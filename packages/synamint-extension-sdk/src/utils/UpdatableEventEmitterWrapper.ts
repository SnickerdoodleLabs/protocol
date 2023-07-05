import { EventEmitter } from "events";

export class UpdatableEventEmitterWrapper extends EventEmitter {
  public constructor(
    protected eventEmitter: EventEmitter,
    protected eventType: string,
  ) {
    super();
    this.init(eventEmitter);
  }
  public update(eventEmitter: EventEmitter) {
    if (this.eventEmitter) {
      this.eventEmitter.removeAllListeners();
    }
    this.init(eventEmitter);
  }

  private init(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    eventEmitter.on(this.eventType, this.eventHandler.bind(this));
  }

  private eventHandler(event) {
    this.emit(this.eventType, event);
  }
}
