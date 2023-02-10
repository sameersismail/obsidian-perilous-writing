import { LOG_LEVEL } from "./constants";

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
