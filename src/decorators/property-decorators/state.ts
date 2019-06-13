import {Constructor} from "../../types/constructor";

/**
 * @typedef StateOptions
 * @property {boolean} [notify=false] If changes to the value of this property should be emitting a ‘property-change’ event.
 */
export interface StateOptions {
  notify?: boolean;
}

export const DefaultStateOptions: StateOptions = {
  notify: false,
};

/**
 * Defines a property that isn’t represented by any attribute, but can cause a re-render upon change. It can be configured by providing an options object.
 * @param {StateOptions} [opts]
 * @decorator
 */
export function State(opts?: StateOptions): PropertyDecorator {
  return function<T>(target, propertyKey) {
    const options = Object.assign({}, DefaultStateOptions, opts);
  }
}
