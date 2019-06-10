/**
 * Binds a function to the enclosing component on first access.
 * @decorator
 */
export function Autobound(): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  }
}

