import {addExtension, ComponentExtension} from "@/component";
import {Constructor, Webcomponent} from "@/types";
import {PARENTS} from "@/constants";

/**
 * @typedef ParentOptions
 * @property {boolean} [walkDom=false] Instead of using the closest method of this component, use parentNode recursively until it either matches the selector or is null or undefined.
 * @property {boolean} [once=false] If the selector should only be queried once and every subsequent access should return the same result.
 * @property {number} [levels] The maximum amout of levels to traverse. This option only has an effect if walkDom is set to true.
 */
export interface ParentOptions {
  selector?: string;
  walkDom?: boolean;
  once?: boolean;
  levels?: number;
}

export const DefaultParentOptions: ParentOptions = {
  walkDom: false,
  once: false
};

/**
 * Defines a property to be a proxy to a queried parent element.
 * By defaukt it will use <code>Element.closest</code> on the the component to query for the parent element.
 * It can be configured with a provided options object.
 * @param {ParentOptions} [opts]
 * @decorator
 */
export function Parent(opts?: ParentOptions): PropertyDecorator {
  return function<T>(target, propertyKey) {
    const options = Object.assign({}, DefaultParentOptions, opts);
    addExtension(target, new ParentExtension(options, propertyKey));
  }
}

function getParentOf(element: HTMLElement, options: ParentOptions): HTMLElement {
  if (!options.selector) return element.parentNode as HTMLElement;
  if (!options.walkDom) return element.closest(options.selector) as HTMLElement;
  let levels = options.levels;
  let current: Node & ParentNode = element;
  while (levels-- && (current = current.parentNode)) {
    if ("host" in current) current = (current as ShadowRoot).host;
    if ((current as HTMLElement).matches(options.selector)) return current as HTMLElement;
  }
}

export class ParentExtension implements ComponentExtension<Webcomponent> {
  constructor(private options: ParentOptions, private propertyKey: string | symbol) {}
  construct(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    const options = this.options;
    const prop = this.propertyKey;
    Object.defineProperty(instance, this.propertyKey, {
      get() {
        if (options.once) {
          if (!this[PARENTS]) this[PARENTS] = {};
          if (this[PARENTS][prop]) return this[PARENTS][prop];
          return this[PARENTS][prop] = getParentOf(this, options);
        } else {
          return getParentOf(this, options);
        }
      }
    });
  }
}
