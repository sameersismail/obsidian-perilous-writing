import { Editor } from "obsidian";

type ProgressBarState = "default" | "warning" | "success" | "failure";

const PROGRESS_BAR_BACKGROUND_ID = "perilous-writing-progress-bar-background";
const PROGRESS_BAR_WRAPPER_ID = "perilous-writing-progress-bar-wrapper";
const PROGRESS_BAR_BAR_ID = "perilous-writing-progress-bar-bar";

const TAB_CONTAINER_CLASS = "workspace-tab-container";

export function addProgressBar(editor: Editor, sessionLength: number) {
  const tabContainer = getEditorTabContainer(getEditorContainer(editor));
  tabContainer.appendChild(ProgressBarBackground());
  tabContainer.appendChild(ProgressBarBar(sessionLength));
}

export function removeProgressBar() {
  const progressBarBackground = activeDocument.getElementById(
    PROGRESS_BAR_BACKGROUND_ID
  );
  const progressBarBar = activeDocument.getElementById(PROGRESS_BAR_WRAPPER_ID);
  progressBarBackground?.remove();
  progressBarBar?.remove();
}

/**
 * `0 <= percent <= 100`.
 */
export function setProgressPercent(percent: number) {
  const element = activeDocument.getElementById(
    PROGRESS_BAR_WRAPPER_ID
  ) as HTMLElement;
  element.style.width = `${percent}%`;
}

/**
 * Halt the progress transition.
 */
export function completeProgressBar() {
  const element = activeDocument.getElementById(
    PROGRESS_BAR_WRAPPER_ID
  ) as HTMLElement;
  element.style.transition = "none";
}

export function setProgressBarState(
  state: ProgressBarState,
  warningPercent: number = 0
): void {
  const element = activeDocument.getElementById(
    PROGRESS_BAR_BAR_ID
  ) as HTMLElement;
  const color = {
    default: "purple",
    success: "green",
    failure: "red",
    warning: "orange",
  }[state];

  if (state === "warning") {
    element.style.background = interpolateWarningColor(warningPercent);
  } else {
    element.style.background = `var(--color-${color})`;
  }
}

/**
 * Progressively more hazardous warning.
 */
function interpolateWarningColor(warningPercent: number): string {
  if (0 <= warningPercent && warningPercent < 40) {
    return "hsl(30deg 100% 46%)";
  } else if (40 <= warningPercent && warningPercent < 60) {
    return "hsl(18deg 86% 54%)";
  } else if (60 <= warningPercent && warningPercent < 70) {
    return "hsl(5deg 84% 58%)";
  } else if (70 <= warningPercent && warningPercent < 80) {
    return "hsl(353deg 81% 5j%)";
  } else {
    return "var(--color-red)";
  }
}

/**
 * Create the progress bar background component.
 */
function ProgressBarBackground(): HTMLElement {
  const wrapper = activeDocument.createElement("div");
  wrapper.id = PROGRESS_BAR_BACKGROUND_ID;
  return wrapper;
}

/**
 * Create the progress bar component.
 */
function ProgressBarBar(sessionLength: number): HTMLElement {
  const wrapper = activeDocument.createElement("div");
  wrapper.id = PROGRESS_BAR_WRAPPER_ID;
  wrapper.style.transition = `width ${sessionLength}ms linear`;

  const inner = activeDocument.createElement("div");
  inner.id = PROGRESS_BAR_BAR_ID;

  wrapper.appendChild(inner);
  return wrapper;
}

/**
 * Traverse the DOM upwards starting from `container` and find the closest-nested
 * parent tab container.
 */
function getEditorTabContainer(container: HTMLElement): HTMLElement {
  while (!container.classList.contains(TAB_CONTAINER_CLASS)) {
    container = container.parentElement as HTMLElement;
  }
  // Set this element as the progress bar's containing block.
  container.style.position = "relative";
  return container;
}

/**
 * Wrap, and unwrap, the undocumented `containerEl` property.
 */
function getEditorContainer(editor: Editor): HTMLElement {
  const containerEl = (editor as Editor & { containerEl: HTMLElement })
    .containerEl;
  return containerEl;
}
