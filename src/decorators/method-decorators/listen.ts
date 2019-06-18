/**
 * @typedef ListenOptions
 * @property {string|Element} [target='host'] A css selector or one of the following: host, document, window, parent or an html element. All css selectors are evaluated from the host element as its root. This can also directly be set in the event string by prefixing it to the event string, followed by an '@' symbol. e.g.: <code>parent@change</code> or <code>.item:not(:first-child)@keyup.</code>.
 * @property {boolean} [once=false] If the event handler should only be registered once on connection and unregistered at component disconnection. Useful for selectors outside of the component scope, such as window, parent, document, etc.
 */
import {addExtension, ComponentExtension} from "../../component";
import {Constructor, Webcomponent} from "../../types";
import {Autobound} from "./autobound";

export interface ListenOptions {
  event?: string;
  target?: string | Element;
  once?: boolean;
}

export const DefaultListenOptions: ListenOptions = {
  target: "host",
  once: false,
};

/**
 * Register a method to be an event listener for the given event.
 * By default the listener will be registered after every render and unregistered before any re-render and on component disconnection.
 * All handlers are automatically bound to the component. It can be configured by providing an options object.
 * @param {ListenOptions|string} [opts]
 * @decorator
 */
export function Listen(opts?: string | ListenOptions): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    const options = Object.assign({}, DefaultListenOptions, typeof opts === "string" ? { event: opts } : opts);
    addExtension(target, new ListenExtension(options, propertyKey, descriptor));
    return Autobound()(target, propertyKey, descriptor);
  }
}

export class ListenExtension implements ComponentExtension<Webcomponent> {
  constructor(private options: ListenOptions, private propertyKey: string | symbol, private descriptor: PropertyDescriptor) {
    if (options.event.indexOf('@') !== -1) {
      const [target, event] = options.event.split('@');
      options.target = target;
      options.event = event;
    }
  }

  target(instance: Webcomponent) {
    return this.options.target === "document" ? document
      : this.options.target === "window" ? window
      : this.options.target === "parent" ? instance.parentNode as HTMLElement
      : typeof this.options.target === "string" ? instance.hostElementRoot.querySelector(this.options.target) as HTMLElement
      : this.options.target as HTMLElement;
  }

  attachHandler(instance: Webcomponent) {
    this.target(instance).addEventListener(this.options.event, instance[this.propertyKey]);
  }

  detachHandler(instance: Webcomponent) {
    this.target(instance).removeEventListener(this.options.event, instance[this.propertyKey]);
  }

  construct(cls: Constructor<Webcomponent>, instance: Webcomponent) {}

  connect(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    this.attachHandler(instance);
  }

  beforeRender(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    if (this.options.once) return;
    this.detachHandler(instance);
  }

  afterRender(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    if (this.options.once) return;
    this.attachHandler(instance);
  }

  disconnect(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    this.detachHandler(instance);
  }
}
