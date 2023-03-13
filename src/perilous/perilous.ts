import { StateField } from "@codemirror/state";
import { Editor, EditorPosition, MarkdownView } from "obsidian";
import { log } from "src/utilities";
import PerilousWritingPlugin from "../main";
import {
  addProgressBar,
  completeProgressBar,
  removeProgressBar,
  setProgressBarState,
  setProgressPercent,
} from "./dom";
import { Scheduler, SchedulerHooks } from "./scheduler";

type SessionType = "short" | "long";
const MILLISECONDS_PER_MINUTE = 60_000;

export function startSession(
  editor: Editor,
  view: MarkdownView,
  plugin: PerilousWritingPlugin,
  sessionType: SessionType
) {
  const sessionLength =
    (sessionType === "short"
      ? plugin.settings.shortSessionLength
      : plugin.settings.longSessionLength) * MILLISECONDS_PER_MINUTE;
  log(`Session length: ${sessionLength / MILLISECONDS_PER_MINUTE}m`);

  const cmExtensions: Array<StateField<unknown>> = [];
  const [initialContent, initialCursor] = getSnapshot(editor);
  removeProgressBar();
  addProgressBar(view, sessionLength);

  const hooks: SchedulerHooks = {
    onInitialisation: () => {
      log("Session requested; waiting for first event");
    },
    onStart: (intervalId: number) => {
      // Begin the CSS transition.
      setProgressPercent(100);
      // If the plugin is unloaded mid-session, deregister the `setInterval`.
      plugin.registerInterval(intervalId);
      log("Scheduler started");
    },
    onEvent: () => {
      setProgressBarState("default");
      log("Event");
    },
    onWarning: (percentCompleted: number) => {
      setProgressBarState("warning", percentCompleted);
      log(`Warning; ${Math.round(percentCompleted)}`);
    },
    onSuccess: () => {
      completeProgressBar();
      setProgressBarState("success");
      log("Session completed successfully");
    },
    onFailure: () => {
      completeProgressBar();
      setProgressBarState("failure");
      replaceSnapshot(editor, view, initialContent, initialCursor);

      log("Session failed; replaced contents with prior revision");
    },
    onTeardown: () => {
      // Remove the extension; make CM aware of the mutation.
      cmExtensions.pop();
      plugin.app.workspace.updateOptions();
      log("Removed: CodeMirror hook; &c.");
    },
  };
  const scheduler = new Scheduler(sessionLength, hooks);

  scheduler.initialise((eventCallback: () => void) => {
    const onInputKeypress = StateField.define({
      create: () => null,
      update: (_, transaction) => {
        if (!transaction.docChanged) {
          return null;
        }
        if (transaction.isUserEvent("input")) {
          eventCallback();
        }
        return null;
      },
    });
    cmExtensions.push(onInputKeypress);
    plugin.registerEditorExtension(cmExtensions);
    log("Registered CodeMirror hook");
  });

  return scheduler;
}

export function abortSession() {
  removeProgressBar();
}

function getSnapshot(editor: Editor): [string, EditorPosition] {
  const doc = editor.getDoc();
  return [doc.getValue(), doc.getCursor()];
}

/**
 * NOTE: This is a destructive, unrecoverable change; use with caution.
 */
function replaceSnapshot(
  editor: Editor,
  view: MarkdownView,
  value: string,
  cursor: EditorPosition
) {
  view.clear();
  // Replace with the prior-saved values.
  const doc = editor.getDoc();
  doc.setValue(value);
  doc.setCursor(cursor);
}
