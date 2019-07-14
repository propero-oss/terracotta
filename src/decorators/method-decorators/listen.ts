/**
 * @typedef ListenOptions
 * @property {string|Element} [target='host'] A css selector or one of the following: host, document, window, parent or an html element. All css selectors are evaluated from the host element as its root. This can also directly be set in the event string by prefixing it to the event string, followed by an '@' symbol. e.g.: <code>parent@change</code> or <code>.item:not(:first-child)@keyup.</code>.
 * @property {boolean} [once=false] If the event handler should only be registered once on connection and unregistered at component disconnection. Useful for selectors outside of the component scope, such as window, parent, document, etc.
 */
import {addExtension, ComponentExtension} from "@/component";
import {Constructor, Webcomponent} from "@/types";
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
    addExtension(target, new ListenExtension(options, propertyKey));
    return Autobound()(target, propertyKey, descriptor);
  }
}

export class ListenExtension implements ComponentExtension<Webcomponent> {
  constructor(private options: ListenOptions, private propertyKey: string | symbol) {
    if (options.event.indexOf('@') !== -1) {
      const [target, event] = options.event.split('@');
      options.target = target;
      options.event = event;
    }
  }

  queryOrGetTarget(instance: Webcomponent) {
    if (typeof this.options.target === "string")
      return instance.hostElementRoot.querySelector(this.options.target) as HTMLElement;
    return this.options.target as HTMLElement;
  }

  target(instance: Webcomponent) {
    switch(this.options.target) {
      case "document": return document;
      case "window": return window;
      case "parent": return instance.parentNode as HTMLElement;
      case "host": return instance;
      default: return this.queryOrGetTarget(instance);
    }
  }

  addOrRemoveListener(instance: Webcomponent, add: boolean) {
    const target = this.target(instance);
    const method = instance[this.propertyKey];
    if (target)
      if (add)
        target.addEventListener(this.options.event, method);
      else
        target.removeEventListener(this.options.event, method);
  }

  connect(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    this.addOrRemoveListener(instance, true);
  }

  beforeRender(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    if (this.options.once) return;
    this.addOrRemoveListener(instance, false);
  }

  afterRender(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    if (this.options.once) return;
    this.addOrRemoveListener(instance, true);
  }

  disconnect(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    this.addOrRemoveListener(instance, false);
  }
}
