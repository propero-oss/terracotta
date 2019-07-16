import {addExtension, ComponentExtension} from "@/component";
import {Constructor, Webcomponent} from "@/types";
import {PARENTS} from "@/constants";
import {getParentOf} from "@/util";

/**
 * @typedef ParentOptions
 * @property {boolean} [walkDom=false] Instead of using the closest method of this component, use parentNode recursively until it either matches the selector or is null or undefined.
 * @property {boolean} [once=false] If the selector should only be queried once and every subsequent access should return the same result, until connected / disconnected.
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

export class ParentExtension implements ComponentExtension<Webcomponent> {
  constructor(private options: ParentOptions, private propertyKey: string | symbol) {}
  construct(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    Object.defineProperty(instance, this.propertyKey, {
      get: this.createGetter(instance)
    });
  }

  disconnect(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    this.unsetParent(instance);
  }

  createGetter(instance) {
    const {options, propertyKey, getOnce} = this;
    return () => {
      if (options.once)
        return getOnce(instance, propertyKey, options);
      return getParentOf(instance, options);
    }
  }

  getOnce(instance: HTMLElement, prop, options) {
    if (!instance[PARENTS]) instance[PARENTS] = {};
    if (instance[PARENTS][prop]) return instance[PARENTS][prop];
    return instance[PARENTS][prop] = getParentOf(instance, options);
  }

  unsetParent(instance: HTMLElement) {
    delete instance[PARENTS];
  }
}
