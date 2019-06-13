/**
 * Injects a registered (@Injectable) into a property.
 * It will execute once on first access to the property.
 * If there is no injectable registered upon first access, a StateError will be thrown.
 * @param {string|Function} what The injectable to inject.
 * @decorator
 */
export function Inject(what: string | Function): PropertyDecorator {
  return function (target, propertyKey) {
    
  }
}
