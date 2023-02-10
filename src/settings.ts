import { PluginSettingTab, App, Setting, Notice } from "obsidian";
import PerilousWritingPlugin from "./main";
import { parseInteger } from "./utilities";

export interface PerilousWritingSettings {
  shortSessionLength: number; // minutes
  longSessionLength: number; // minutes
}

export const DEFAULT_SETTINGS: PerilousWritingSettings = {
  shortSessionLength: 5,
  longSessionLength: 10,
};

export class PerilousWritingSettingTab extends PluginSettingTab {
  plugin: PerilousWritingPlugin;

  constructor(app: App, plugin: PerilousWritingPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", {
      text: "Perilous Writing: Settings",
    });

    new Setting(containerEl)
      .setName("Short session length (minutes)")
      .addText((text) =>
        text
          .setPlaceholder("Enter length in minutes")
          .setValue(this.plugin.settings.shortSessionLength.toString())
          .onChange(async (value) => {
            const length = parseInteger(value);
            if (length !== undefined && length > 0) {
              this.plugin.settings.shortSessionLength = length;
              await this.plugin.saveSettings();
            } else if (value === "") {
              this.plugin.settings.shortSessionLength =
                DEFAULT_SETTINGS.shortSessionLength;
              await this.plugin.saveSettings();
            } else {
              new Notice(
                `Error: value '${value}' is not a valid session length.`
              );
            }
          })
      );

    new Setting(containerEl)
      .setName("Long session length (minutes)")
      .addText((text) =>
        text
          .setPlaceholder("Enter length in minutes")
          .setValue(this.plugin.settings.longSessionLength.toString())
          .onChange(async (value) => {
            const length = parseInteger(value);
            if (length !== undefined && length > 0) {
              this.plugin.settings.longSessionLength = length;
              await this.plugin.saveSettings();
            } else if (value === "") {
              this.plugin.settings.longSessionLength =
                DEFAULT_SETTINGS.longSessionLength;
              await this.plugin.saveSettings();
            } else {
              new Notice(
                `Error: value '${value}' is not a valid session length.`
              );
            }
          })
      );
  }
}
