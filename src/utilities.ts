import { LOG_LEVEL } from "./constants";
import { App, Modal, Notice, Setting } from "obsidian";

/**
 * Coerce a string to an integer, safely.
 */
export function parseInteger(s: string): number | undefined {
  const n = Number.parseInt(s);
  if (!Number.isNaN(n)) {
    return n;
  } else {
    return undefined;
  }
}

/**
 * Parse a floating point number, safely.
 */
function parseFloating(s: string): number | undefined {
  const n = Number.parseFloat(s);
  if (!Number.isNaN(n)) {
    return n;
  } else {
    return undefined;
  }
}

/**
 * Round a floating point number to a given number of decimal places.
 */
export function roundFloat(n: number, dp: number): number {
  return Math.round(n * 10 ** dp) / 10 ** dp;
}

/**
 * Simple logging utility.
 */
export function log(event: unknown): void {
  if (LOG_LEVEL === false) {
    return;
  }
  const now = new Date();
  console.log(
    `[PW][${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}]` +
      ` ${event}`
  );
}

export class CustomSessionModal extends Modal {
  input: string;
  onSubmit: (sessionLength: number) => void;

  constructor(app: App, onSubmit: (sessionLength: number) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Begin custom session" });

    new Setting(contentEl).setName("Length (minutes)").addText((text) =>
      text.onChange((input: string) => {
        this.input = input;
      })
    );

    new Setting(contentEl).addButton((btn) =>
      btn
        .setButtonText("Submit")
        .setCta()
        .onClick(() => {
          const sessionLength = parseFloating(this.input);
          if (sessionLength === undefined || sessionLength <= 0) {
            new Notice(`Error: Please enter a valid, positive number.`);
            return;
          }
          this.onSubmit(sessionLength);
          this.close();
        })
    );
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}
