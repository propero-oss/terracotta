import {addExtension, ComponentExtension} from "@/component";
import {Constructor, Webcomponent} from "@/types";
import {PROPERTY_TYPES} from "@/constants";

/**
 * Registers a method to be called before the provided property changes.
 * If it throws an exception, the change is reverted / blocked.
 * The return value of the method will be the new value, so any normalization can also take place here.
 * It will be called with the following parameters:
 *  - newVal: The new value.
 *  - oldVal: The value before it was modified
 *  - property: The property that was changed
 *  - type: The type of the property, if defined
 * @param {string} property The property to validate
 * @decorator
 */
export function Validate(property: string | symbol): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    const type = target[PROPERTY_TYPES] ? target[PROPERTY_TYPES][property] : Reflect.getMetadata("design:type", target, property);
    addExtension(target, new ValidateExtension(property, propertyKey, type));
    return descriptor;
  }
}

export class ValidateExtension implements ComponentExtension<Webcomponent> {

  observedProperties: (string | symbol)[];

  constructor(private property: string | symbol, private propertyKey: string | symbol, private type?: Function) {
    this.observedProperties = [property];
  }

  beforePropertyChange(cls: Constructor<Webcomponent>, instance: Webcomponent, key: string | symbol, oldVal: any, newVal: any): any {
    if (key !== this.property) return newVal;
    const validator = instance[this.propertyKey].bind(instance);
    try {
      return validator(newVal, oldVal, key, this.type);
    } catch (e) {
      return oldVal;
    }
  }
}
