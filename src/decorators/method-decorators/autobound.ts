/**
 * Binds a function to the enclosing component on access.
 * @decorator
 */
export function Autobound(): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    const orig = descriptor.value as unknown as Function;
    delete descriptor.value;
    descriptor.get = function() { return orig.bind(this); };
    return descriptor;
  }
}
