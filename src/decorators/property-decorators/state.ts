import {addExtension, ComponentExtension} from "@/component";
import {Webcomponent, Constructor} from "@/types";
import {NotifyEvent} from "@/properties/notify";
import {Stages} from "@/constants";

/**
 * @typedef StateOptions
 * @property {boolean} [notify=false] If changes to the value of this property should be emitting a ‘property-change’ event.
 * @property {boolean} [rerender=true] If changes to the value of this property should cause the component to be re-rendered.
 */
export interface StateOptions {
  notify?: boolean;
  rerender?: boolean;
}

export const DefaultStateOptions: StateOptions = {
  notify: false,
  rerender: true
};

/**
 * Defines a property that isn’t represented by any attribute, but can cause a re-render upon change. It can be configured by providing an options object.
 * @param {StateOptions} [opts]
 * @decorator
 */
export function State(opts?: StateOptions): PropertyDecorator {
  return function<T>(target, propertyKey) {
    const options = Object.assign({}, DefaultStateOptions, opts);
    addExtension(target, new StateExtension(options, propertyKey));
  }
}

export class StateExtension implements ComponentExtension<Webcomponent> {
  constructor(private opts: StateOptions, private propertyKey: string | symbol) {}

  afterPropertyChange(cls: Constructor<Webcomponent>, instance: Webcomponent, key: string | symbol, oldVal: any, newVal: any) {
    if (this.propertyKey === key) {
      if (this.opts.notify)
        instance.dispatchEvent(new NotifyEvent(newVal, oldVal, Stages.PROPERTY));
      if (this.opts.rerender)
        instance._requestRerender();
    }
  }
}
