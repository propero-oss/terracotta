/**
 * Registers a method to be called after the provided property changes.
 * It will be called with the following parameters:
 *  - newVal: The new value
 *  - oldVal: The value before it was modified
 *  - property: The property that was changed
 * @param {string} property The property to watch
 * @decorator
 */
import {addExtension, ComponentExtension} from "@/component";
import {Constructor, Webcomponent} from "@/types";

export function Watch(property: string | symbol): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    addExtension(target, new WatchExtension(property, propertyKey));
    return descriptor;
  }
}

export class WatchExtension implements ComponentExtension<Webcomponent> {

  observedProperties: (string | symbol)[];

  constructor(private property: string | symbol, private propertyKey: string | symbol) {
    this.observedProperties = [property];
  }

  afterPropertyChange(cls: Constructor<Webcomponent>, instance: Webcomponent, key: string | symbol, oldVal: any, newVal: any) {
    if (key !== this.property) return;
    instance[this.propertyKey].call(instance, newVal, oldVal, key);
  }
}
