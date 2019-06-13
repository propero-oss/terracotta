import {Constructor} from "../../types/constructor";

/**
 * @typedef InheritOptions
 * @property {string} [selector] The selector to match parent elements against. If it isn’t set, the first level parent will always be used instead.
 * @property {boolean} [rerender=false] If set to true, the component will be re-rendered upon changes to this property.
 * @property {boolean} [walkDom=false] Instead of using the closest method of this component, use parentNode recursively until it either matches the selector or is null or undefined. Useful for traversing out of shadow dom trees.
 * @property {number} [levels] The maximum amount of levels to traverse. This option only has an effect if walkDom is set to true.
 * @property {string} [property] Which property to inherit, if it isn’t explicitly set, the same property name will be used.
 * @property {string[]} [syncOn] The events of the parent control that cause this attribute to change. If none are provided, property-change is used instead.
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
  syncOn: ['property-change']
};

/**
 * Defines a property that inherits its value from its parent (the component it is embedded in). It can be configured by providing an options object.
 * @param {InheritOptions} [opts]
 * @decorator
 */
export function Inherit(opts?: InheritOptions): PropertyDecorator {
  return function<T>(target, propertyKey) {
    const options = Object.assign({}, DefaultInheritOptions, opts);
  }
}
