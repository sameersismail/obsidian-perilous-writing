import { Editor, MarkdownView, Notice, Plugin } from "obsidian";
import { startSession, abortSession } from "./perilous";
import { canStartScheduler, Scheduler } from "./perilous/scheduler";
import {
  DEFAULT_SETTINGS,
  PerilousWritingSettings,
  PerilousWritingSettingTab,
} from "./settings";
import { CustomSessionModal, log, roundFloat } from "./utilities";

export default class PerilousWritingPlugin extends Plugin {
  settings: PerilousWritingSettings;
  scheduler: Scheduler | undefined;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new PerilousWritingSettingTab(this.app, this));

    this.addCommand({
      id: "short-session",
      name: `Begin short session`,
      editorCallback: (editor: Editor, view: MarkdownView) => {
        if (canStartScheduler(this.scheduler)) {
          this.scheduler = startSession(editor, view, this, "short");
        } else {
          new Notice("A session is already in progress.");
        }
      },
    });

    this.addCommand({
      id: "long-session",
      name: `Begin long session`,
      editorCallback: (editor: Editor, view: MarkdownView) => {
        if (canStartScheduler(this.scheduler)) {
          this.scheduler = startSession(editor, view, this, "long");
        } else {
          new Notice("A session is already in progress.");
        }
      },
    });

    this.addCommand({
      id: "custom-session",
      name: `Begin custom session`,
      editorCallback: (editor: Editor, view: MarkdownView) => {
        if (!canStartScheduler(this.scheduler)) {
          new Notice("A session is already in progress.");
          return;
        }

        new CustomSessionModal(this.app, (sessionLength) => {
          this.scheduler = startSession(
            editor,
            view,
            this,
            "custom",
            roundFloat(sessionLength, 1)
          );
        }).open();
      },
    });

    log("Loaded plugin");
  }

  onunload() {
    if (this.scheduler !== undefined) {
      this.scheduler.teardown();
      abortSession();
    }
    log("Unloaded plugin");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
