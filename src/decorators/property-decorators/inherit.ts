import {addExtension, ComponentExtension} from "@/component";
import {Webcomponent, Constructor} from "@/types";
import {INHERIT_HANDLERS} from "@/constants";
import {getParentOf} from "@/util";

/**
 * @typedef InheritOptions
 * @property {string} [selector] The selector to match parent elements against. If it isn’t set, the first level parent will always be used instead.
 * @property {boolean} [rerender=false] If set to true, the component will be re-rendered upon changes to this property.
 * @property {boolean} [walkDom=false] Instead of using the closest method of this component, use parentNode recursively until it either matches the selector or is null or undefined. Useful for traversing out of shadow dom trees.
 * @property {number} [levels] The maximum amount of levels to traverse. This option only has an effect if walkDom is set to true.
 * @property {string} [property] Which property to inherit, if it isn’t explicitly set, the same property name will be used.
 * @property {string[]} [syncOn] The events of the parent control that cause this attribute to change. If none are provided, property-change and change are used instead.
 */
export interface InheritOptions {
  selector?: string;
  rerender?: boolean;
  walkDom?: boolean;
  levels?: number;
  property?: string;
  syncOn?: string[];
}

export const DefaultInheritOptions: InheritOptions = {
  rerender: false,
  walkDom: false,
  syncOn: ['property-change', 'change']
};

/**
 * Defines a property that inherits its value from its parent (the component it is embedded in). It can be configured by providing an options object.
 * @param {InheritOptions} [opts]
 * @decorator
 */
export function Inherit(opts?: InheritOptions): PropertyDecorator {
  return function<T>(target, propertyKey) {
    const options = Object.assign({}, DefaultInheritOptions, {property: propertyKey}, opts);
    addExtension(target, new InheritExtension(options, propertyKey));
  }
}

export class InheritExtension implements ComponentExtension<Webcomponent> {
  constructor(private options: InheritOptions, private propertyKey: string | symbol) {}

  syncProperty(instance: Webcomponent, parent: HTMLElement) {
    // @ts-ignore
    instance[this.propertyKey] = parent[this.options.property || this.propertyKey];
    if (this.options.rerender)
      instance._requestRerender();
  }

  addHandlerMeta(instance: Webcomponent, handler: () => void) {
    const meta = instance[INHERIT_HANDLERS] || (instance[INHERIT_HANDLERS] = {});
    meta[this.propertyKey] = handler;
  }

  getHandlerMeta(instance: Webcomponent) {
    const meta = instance[INHERIT_HANDLERS] || (instance[INHERIT_HANDLERS] = {});
    return meta[this.propertyKey];
  }

  deleteHandlerMeta(instance: Webcomponent) {
    const meta = instance[INHERIT_HANDLERS] || (instance[INHERIT_HANDLERS] = {});
    const handler = meta[this.propertyKey];
    delete meta[this.propertyKey];
    return handler;
  }

  connect(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    const parent = getParentOf(instance, this.options);
    if (!parent) return;
    this.syncProperty(instance, parent);
    const handler = this.syncProperty.bind(this, instance, parent);
    this.options.syncOn.forEach(evt => parent.addEventListener(evt, handler));
    this.addHandlerMeta(instance, handler);
  }

  disconnect(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    const parent = getParentOf(instance, this.options);
    if (!parent) return;
    const handler = this.deleteHandlerMeta(instance);
    if (handler)
      this.options.syncOn.forEach(evt => parent.removeEventListener(evt, handler));
  }
}
