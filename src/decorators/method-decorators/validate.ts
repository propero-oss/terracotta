/**
 * Registers a method to be called before the provided property changes.
 * If it throws an exception, the change is reverted / blocked.
 * The return value of the method will be the new value, so any normalization can also take place here.
 * It will be called with the following parameters:
 *  - newVal: The new value.
 *  - oldVal: The value before it was modified
 *  - property: The property that was changed
 *  - stage: The stage at which it was changed. It can be one of the following:
 *    - attr: changed by attribute change
 *    - model: changed by model change
 *    - state: changed by state change
 *    - prop: changed by property change
 *  - type: The type of the property, if defined
 * @param {string} property The property to validate
 * @decorator
 */
export function Validate(property: string): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  }
}

