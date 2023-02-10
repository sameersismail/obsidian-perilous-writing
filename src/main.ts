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

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new PerilousWritingSettingTab(this.app, this));

    this.addCommand({
      id: "perilous-writing-short-session",
      name: `Begin short session`,
      editorCallback: (editor: Editor, view: MarkdownView) => {
        startSession(editor, view, this, "short");
      },
    });

    this.addCommand({
      id: "perilous-writing-long-session",
      name: `Begin long session`,
      editorCallback: (editor: Editor, view: MarkdownView) => {
        startSession(editor, view, this, "long");
      },
    });

    log("Loaded plugin");
  }

  onunload() {
    abortSession();
    log("Unloaded plugin");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
