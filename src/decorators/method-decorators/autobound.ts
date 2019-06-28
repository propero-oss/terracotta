/**
 * Binds a function to the enclosing component on access.
 * @decorator
 */
import {addExtension, ComponentExtension} from "@/component";
import {Webcomponent} from "@/types";

export function Autobound(): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    addExtension(target, new AutoboundExtension(propertyKey));
    return descriptor;
  }
}

export class AutoboundExtension implements ComponentExtension<Webcomponent> {
  constructor(private propertyKey: string | symbol) {}
  construct(cls, instance) {
    instance[this.propertyKey] = instance[this.propertyKey].bind(instance);
  }
}
