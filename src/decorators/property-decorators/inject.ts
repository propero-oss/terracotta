/**
 * Injects a registered (@Injectable) into a property.
 * It will execute once on first access to the property.
 * If there is no injectable registered upon first access, a StateError will be thrown.
 * @param {string|Function} what injectable to inject.
 * @param {any} [meta] any metadata to pass to the injectable factory.
 * @decorator
 */
import {addExtension, ComponentExtension} from "../../component";
import {Constructor, Webcomponent} from "../../types";
import {Injectables} from "..";

export function Inject(what: string | Function, meta: any): PropertyDecorator {
  return function (target, propertyKey) {
    addExtension(target, new InjectExtension(target as Webcomponent, propertyKey, what, meta));
  }
}

export class InjectExtension implements ComponentExtension<Webcomponent> {
  constructor(private target: Webcomponent, private propertyKey: string | symbol, private id: string | Function, private meta: any) {}

  construct(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    Injectables.inject(this.id, this.target, this.propertyKey, this.meta);
  }

}
