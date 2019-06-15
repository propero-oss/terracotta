import {toKebapCase} from "../../util";
import {Constructor, Webcomponent} from "../../types";
import {addExtension, ComponentExtension} from "../../component";

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
  return toKebapCase(property).replace(/^on-/,'').replace(/-event$/, '');
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
    addExtension(target, new EventExtension(options, propertyKey));
  }
}

export class EventExtension implements ComponentExtension<Webcomponent> {
  constructor(public options: EventOptions, private propertyKey: string | symbol) {}

  construct(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    Object.defineProperty(instance, this.propertyKey, {
      value: new EventEmitter<any>(this.options, instance),
      writable: false,
      configurable: false,
      enumerable: false
    });
  }
}

export class EventEmitter<T> {
  constructor(public options: EventOptions, private source: Webcomponent) {}
  emit(data: T) {
    return this.source.dispatchEvent(new CustomEvent(this.options.name, Object.assign({}, this.options, {detail: data})));
  }
  attach(fn: (ev: CustomEvent<T>) => void) {
    return this.source.addEventListener(this.options.name, fn);
  }
  detach(fn: (ev: CustomEvent<T>) => void) {
    return this.source.removeEventListener(this.options.name, fn);
  }
}
