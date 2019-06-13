import {Constructor} from "../../types/constructor";
import {toKebapCase} from "../../util";

/**
 * @typedef InjectableOptions
 * @property {boolean} [singleton=false] If this is set to true, only one instance will ever be constructed and injected.
 * @property {string} [factory] The static method used to construct the injectible. It will be passed the component as its first argument and the property name and metadata as argument 2 and 3 respectively.
 * @property {boolean} [static=false] If this is set to true, the class itself will be injected instead of instances thereof.
 */
export interface InjectableOptions {
  singleton?: boolean;
  factory?: string;
  static?: boolean;
}

export const DefaultInjectableOptions : InjectableOptions = {
  singleton: false,
  static: false
};

/**
 * Defines a class to be injectable.
 * Injectable classes can later be injected into component properties using @Inject.
 * By default Injectables are registered under their class name if no name is provided and will be initialized once per @Inject property.
 * It accepts an options object to further configure how it will be injected.
 * @param {string} [name] The name under which to register this injectable. Defaults to kebap-cased class name.
 * @param {InjectableOptions} [opts]
 * @decorator
 */
export function Injectable<T>(name?: string, opts?: InjectableOptions): <T>(target: Constructor<T>) => Constructor<T> {
  return function<T>(target: Constructor<T>): Constructor<T> {
    const options = Object.assign({}, DefaultInjectableOptions, {name: name || toKebapCase(target.name)}, opts);

    return target;
  }
}
