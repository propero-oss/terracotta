import {Constructor} from "../../types/constructor";

/**
 * @typedef QueryOptions
 * @property {string} [target="host"] The element to query. It can be one of the following: host, parent, document.
 * @property {boolean} [once=false] If the selector should only be queried once and every subsequent access should return the same result.
 * @property {boolean} [onRender=false] If the selector should only be queried once per render.
 * @property {boolean} [multiple=false] If this is set to true, querySelectorAll will be used.
 */
export interface QueryOptions {
  target?: string | Element;
  once?: boolean;
  onRender?: boolean;
  multiple?: boolean;
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
export function Query(selector: string, opts?: QueryOptions): PropertyDecorator {
  return function<T>(target, propertyKey) {
    const options = Object.assign({}, DefaultQueryOptions, opts, {selector: selector});

  }
}
