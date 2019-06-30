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
    const root = this.root(el);
    return options.multiple ? [...root.querySelectorAll(selector)] : root.querySelector(selector);
  }

  root(el: Webcomponent) {
    switch (this.options.target) {
      case "host":
        return el.hostElementRoot;
      case "document":
        return document;
      case "parent":
        return el.parentNode;
      default:
        return this.options.target as HTMLElement;
    }
  }

  construct(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    Object.defineProperty(instance, this.propertyKey, {
      get: this.queryGetter.bind(this)
    });
  }

  queryGetter(instance: Webcomponent) {
    if (this.options.once || this.options.onRender) {
      if (!this[QUERIES])
        this[QUERIES] = {};
      if (this[QUERIES[this.propertyKey]])
        return this[QUERIES[this.propertyKey]];
      return this.query(instance);
    }
  }

  afterRender(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    if (this.options.onRender) {
      if (!instance[QUERIES]) instance[QUERIES] = {};
      instance[QUERIES][this.propertyKey] = this.query(instance);
    }
  }
}
