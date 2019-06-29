import {Constructor} from "@/types";
import {toKebapCase} from "@/util";

/**
 * @typedef InjectableOptions
 * @property {boolean} [singleton=false] If this is set to true, only one instance will ever be constructed and injected.
 * @property {string} [factory] The static method used to construct the injectible.
 * It will be passed the component as its first argument and the property name and metadata as argument 2 and 3 respectively.
 * Passing arguments is disabled when singleton is set to true.
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
    const options = Object.assign({}, DefaultInjectableOptions, opts);
    name = name || toKebapCase(target.name);
    Injectables.register(name, options, target);
    return target;
  }
}


export class Injectables {
  private static injectables: {[key: string]: {val: any, options: InjectableOptions}} = {};
  private static singletons: {[key: string]: any};

  static nameFor(id: string | Function): string {
    return typeof id === "string" ? id : toKebapCase(id.name);
  }

  static register(id: string | Function, options: InjectableOptions, value: any) {
    return this.injectables[this.nameFor(id)] = {
      val: value,
      options: options
    };
  }

  static get(id: string | Function): any {
    return this.bundle(id).val;
  }

  static opts(id: string | Function): InjectableOptions {
    return this.bundle(id).options;
  }

  static bundle(id: string | Function): ({val: any, options: InjectableOptions}) {
    const bundle = this.injectables[this.nameFor(id)];
    if (!bundle) throw new ReferenceError("No such Injectable: " + id);
    return bundle;
  }

  static inject(id: string | Function, target: any, property: string | symbol, meta: any) {
    Object.defineProperty(target, property, {
      get() {
        const {options, val} = Injectables.bundle(id);
        const name = Injectables.nameFor(id);
        if (options.static) return val;
        if (options.singleton) {
          if (Injectables.singletons[name]) return Injectables.singletons[name];
          return Injectables.singletons[name] = options.factory ? val[options.factory](this) : new val();
        } else {
          return options.factory ? val[options.factory](this, property, meta) : new val();
        }
      }
    })
  }
}
