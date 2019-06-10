import {toKebapCase} from "../../util";

/**
 * @typedef EventOptions
 * @property {boolean} [cancelable=false] Allows the event to be canceled with event.preventDefault(). If this is set to true, the emit method will return a boolean, true if the event was not cancelled. false if it was. otherwise returns undefined.
 * @property {boolean} [composed=false] If the event path should be composed.
 * @property {boolean} [bubbles=false] If the event should bubble through all parent elements.
 */
export interface EventOptions {
  cancelable?: boolean;
  composed?: boolean;
  bubbles?: boolean;
  name?: string;
}

export const DefaultEventOptions: EventOptions = {
  cancelable: false,
  composed: false,
  bubbles: false,
};

export function defaultEventName(property: string) {
  return toKebapCase(property).replace(/^on-/,'');
}

/**
 * Defines a property to be an event emitter.
 * The property will automatically be assigned an EventEmitter instance.
 * It has the methods emit(data) to emit the event, lock() to lock the event from being fired and unlock() to make it be able to fire again.
 * It can be configured with a provided options object.
 * @param {EventOptions} [opts]
 * @decorator
 */
export function Event(opts?: EventOptions): PropertyDecorator {
  return function<T>(target, propertyKey) {
    const options = Object.assign({}, DefaultEventOptions, {name: defaultEventName(propertyKey)}, opts);
  }
}
