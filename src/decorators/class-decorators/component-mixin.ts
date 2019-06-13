import {Constructor} from "../../types/constructor";

/**
 * Defines a partial feature set to be mixed into other components. It can be mixed using the Mixing function like this:
 * @example <pre>class HTMLFooBarElement extends Mixing(TheMixin)(HTMLElement) {}</pre>
 * @decorator
 */
export function ComponentMixin<T>(): <T>(target: Constructor<T>) => Constructor<T> {
  return function<T>(target: Constructor<T>): Constructor<T> {



    return target;
  }
}
