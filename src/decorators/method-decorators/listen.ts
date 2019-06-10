/**
 * @typedef ListenOptions
 * @property {string|Element} [target='host'] A css selector or one of the following: host, document, window, parent or an html element. All css selectors are evaluated from the host element as its root. This can also directly be set in the event string by prefixing it to the event string, followed by an '@' symbol. e.g.: <code>parent@change</code> or <code>.item:not(:first-child)@keyup.</code>.
 * @property {boolean} [once=false] If the event handler should only be registered once on connection and unregistered at component disconnection. Useful for selectors outside of the component scope, such as window, parent, document, etc.
 * @property {number} [debounce] The number of milliseconds this handler will be blocked for after every execution.
 * @property {number} [debuffer] The number of milliseconds this handler will be executed at after every event emission, with subsequent event emissions within the debuffer span resetting the delay.
 * @property {number} [delay] The number of milliseconds every execution will be delayed for.
 */
export interface ListenOptions {
  target?: string | Element;
  once?: boolean;
  debounce?: number;
  debuffer?: number;
  delay?: number;
}

export const DefaultListenOptions: ListenOptions = {
  target: "host",
  once: false,
};

/**
 * Register a method to be an event listener for the given event.
 * By default the listener will be registered after every render and unregistered before any re-render and on component disconnection.
 * All handlers are automatically bound to the component. It can be configured by providing an options object.
 * @param {string} event The event to listen for
 * @param {ListenOptions} [opts]
 * @decorator
 */
export function Listen(event: string, opts?: ListenOptions): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    const options = Object.assign({}, DefaultListenOptions, opts);
    return descriptor;
  }
}

