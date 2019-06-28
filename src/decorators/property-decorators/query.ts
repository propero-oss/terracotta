import {Constructor} from "@/types";
import {addExtension, ComponentExtension} from "@/component";
import {Webcomponent} from "@/types";
import {QUERIES} from "@/constants";

/**
 * @typedef QueryOptions
 * @property {string|Element} [target="host"] The element to query. It can be one of the following: host, parent, document or an HTMLElement.
 * @property {boolean} [once=false] If the selector should only be queried once and every subsequent access should return the same result.
 * @property {boolean} [onRender=false] If the selector should only be queried once per render.
 * @property {boolean} [multiple=false] If this is set to true, querySelectorAll will be used.
 */
export interface QueryOptions {
  target?: string | Element;
  once?: boolean;
  onRender?: boolean;
  multiple?: boolean;
  selector?: string;
}

export const DefaultQueryOptions: QueryOptions = {
  target: "host",
  once: false,
  onRender: false,
  multiple: false
};

/**
 * Defines a property to be a proxy to a queried element.
 * By default it will use querySelector on the element or shadow root to query for it inside of the host element and will be excecuted once per access.
 * It can be configured by providing an options object.
 * @param {string} selector The CSS selector to query.
 * @param {QueryOptions} [opts]
 * @decorator
 */
export function Query(selector: string | QueryOptions): PropertyDecorator {
  return function<T>(target, propertyKey) {
    const options = Object.assign({}, DefaultQueryOptions, typeof selector === "string" ? {selector: selector} : selector);
    addExtension(target, new QueryExtension(options, options.selector, propertyKey));
  }
}


export class QueryExtension implements ComponentExtension<Webcomponent> {
  constructor(private options: QueryOptions, private selector: string, private propertyKey: string | symbol) {}

  query(el: Webcomponent) {
    const options = this.options;
    const selector = this.selector;
    const root = options.target === "host" ? el.hostElementRoot
      : options.target === "document" ? document
      : options.target === "parent" ? el.parentNode as HTMLElement
      : options.target as HTMLElement;
    return options.multiple ? [...root.querySelectorAll(selector)] : root.querySelector(selector);
  }

  construct(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    const options = this.options;
    const key = this.propertyKey;
    const q = this.query.bind(this);

    Object.defineProperty(instance, key, {
      get() {
        if (options.once || options.onRender) {
          if (!this[QUERIES]) this[QUERIES] = {};
          if (this[QUERIES][key]) return this[QUERIES][key];
          return q(this);
        } else {
          return q(this);
        }
      }
    });
  }

  afterRender(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    if (this.options.onRender) {
      if (!instance[QUERIES]) instance[QUERIES] = {};
      instance[QUERIES][this.propertyKey] = this.query(instance);
    }
  }
}
