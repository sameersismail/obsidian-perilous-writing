type SchedulerState = "initialised" | "running" | "success" | "failure";

export type SchedulerHooks = {
  /* The first entry point into the application; a session has been requested. */
  onInitialisation: () => void;
  /* The first event has begun the session. */
  onStart: (intervalId: number) => void;
  /* For each event. */
  onEvent: () => void;
  /* When we're within the warning interval. */
  onWarning: (percentCompleted: number) => void;
  /* If a session is completed successfully. */
  onSuccess: () => void;
  /* If a session is unsuccessful. */
  onFailure: () => void;
  /* After a successful or unsuccessful session.  */
  onTeardown: () => void;
  // onTick: () => {};
};

export class Scheduler {
  // Core parameters
  timeoutInterval: number = 5_000;
  warningInterval: number = 2_000;
  tickLength: number = 100;
  sessionLength: number;

  // Event hooks
  hooks: SchedulerHooks;

  // Scheduler state
  schedulerState: SchedulerState = "initialised";

  // Internals
  elapsedTime: number = 0;
  sinceLastEvent: number = 0;
  startedScheduler: boolean = false;
  intervalId: number | undefined = undefined;
  eventCallback: () => void;

  constructor(sessionLength: number, hooks: SchedulerHooks) {
    this.sessionLength = sessionLength;
    this.hooks = hooks;
    this.eventCallback = this.onEvent.bind(this);
  }

  /**
   * Register the primary event stream handler.
   */
  initialise(registerEventGenerator: (callback: () => void) => void) {
    this.hooks.onInitialisation();
    // The user-supplied event generator hooks into the scheduler by
    // executing an opaque `eventCallback` on each event. This is then
    // mapped to the scheduler-internal `onEvent`.
    registerEventGenerator(this.eventCallback);
  }

  tick() {
    const {
      sessionLength,
      timeoutInterval,
      warningInterval,
      tickLength,
      elapsedTime,
      sinceLastEvent,
    } = this;

    if (elapsedTime >= sessionLength) {
      this.succeed();
      return;
    } else if (sinceLastEvent >= timeoutInterval) {
      this.fail();
      return;
    }

    if (warningInterval <= sinceLastEvent && sinceLastEvent < timeoutInterval) {
      this.warning();
    }

    this.sinceLastEvent += tickLength;
    this.elapsedTime += tickLength;
  }

  onEvent() {
    if (this.startedScheduler === false) {
      this.intervalId = window.setInterval(
        this.tick.bind(this),
        this.tickLength
      );
      this.startedScheduler = true;
      this.schedulerState = "running";
      this.hooks.onStart(this.intervalId);
    } else {
      this.sinceLastEvent = 0;
      this.hooks.onEvent();
    }
  }

  succeed() {
    this.schedulerState = "success";
    this.hooks.onSuccess();
    this.teardown();
  }

  warning() {
    const { warningInterval, sinceLastEvent, timeoutInterval } = this;
    this.hooks.onWarning(
      ((sinceLastEvent - warningInterval) /
        (timeoutInterval - warningInterval)) *
        100
    );
  }

  fail() {
    this.schedulerState = "failure";
    this.hooks.onFailure();
    this.teardown();
  }

  teardown() {
    this.hooks.onTeardown();
    clearInterval(this.intervalId);
  }
}

/**
 * A scheduler can be requested if (1) there is no current scheduler, or (2)
 * the previous scheduler is not in progress.
 */
export function canStartScheduler(scheduler: Scheduler | undefined): boolean {
  return (
    scheduler === undefined ||
    (scheduler.schedulerState !== "initialised" &&
      scheduler.schedulerState !== "running")
  );
}
