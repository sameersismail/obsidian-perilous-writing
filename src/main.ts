import { StateField } from "@codemirror/state";
import { Editor, MarkdownView, Plugin } from "obsidian";
import { startSession, abortSession } from "./perilous";
import {
  DEFAULT_SETTINGS,
  PerilousWritingSettings,
  PerilousWritingSettingTab,
} from "./settings";
import { log } from "./utilities";

export default class PerilousWritingPlugin extends Plugin {
  settings: PerilousWritingSettings;
  cmExtensions: Array<StateField<unknown>> = [];

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new PerilousWritingSettingTab(this.app, this));

    this.addCommand({
      id: "short-session",
      name: `Begin short session`,
      editorCallback: (editor: Editor, view: MarkdownView) => {
        startSession(editor, view, this, this.cmExtensions, "short");
      },
    });

    this.addCommand({
      id: "long-session",
      name: `Begin long session`,
      editorCallback: (editor: Editor, view: MarkdownView) => {
        startSession(editor, view, this, this.cmExtensions, "long");
      },
    });

    log("Loaded plugin");
  }

  onunload() {
    abortSession();
    // Remove the CodeMirror transaction handler, if it still exists.
    if (this.cmExtensions.length > 0) {
      this.cmExtensions.pop();
      this.app.workspace.updateOptions();
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
