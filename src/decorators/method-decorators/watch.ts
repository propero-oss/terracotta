/**
 * Registers a method to be called after the provided property changes.
 * It will be called with the following parameters:
 *  - newVal: The new value
 *  - oldVal: The value before it was modified
 *  - property: The property that was changed
 *  - stage: The stage at which it was changed. It can be one of the following:
 *    - attr: changed by attribute change
 *    - model: changed by model change
 *    - state: changed by state change
 *    - prop: changed by property change
 * @param {string} property The property to watch
 * @decorator
 */
export function Watch(property: string): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  }
}

