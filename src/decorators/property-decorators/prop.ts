import "reflect-metadata";
import {toKebapCase} from "@/util";
import {addExtension, ComponentExtension} from "@/component/extension";
import {Constructor, Webcomponent} from "@/types";
import {PROPERTY_TYPES, Stages} from "@/constants";
import {NotifyEvent, defaultAttributeProcessor} from "@/properties";

/**
 * @typedef PropertyOptions
 * @property {boolean} [mutable=false] If the value of this property can be modified after initialization of the component.
 * @property {boolean} [notify=false] If changes to the value of this property should be emitting a ‘property-change’ event.
 * @property {'attr'|'prop'|'both'|'none'|'init'} [sync='init'] In which way changes should be reflected between attribute and property. It can have one of the following values:
 *   - attr Changes to the property are synced to the attribute
 *   - prop Changes to the attribute are synced to the property
 *   - both Changes to the property are synced to the attribute and vice versa
 *   - none No changes are synced
 *   - init The initial value of the attribute is synced to the property
 * @property {(string|boolean)=>any} [parser] A parser function to be used to parse the value of the attribute if it is synced to the property
 * @property {(any)=>string|boolean} [serializer] A serializer function to be used to serialize the value of the property if it is synced to the attribute
 * @property {Function} [type] The type of the property, does not need to be set if Typescript is used and emitDecoratorMetadata is set to true. Otherwise defaults to Object.
 * @property {boolean} [rerender=true] If set to true, the component will be re-rendered upon changes to this property.
 * @property {string} [attribute] The name of the attribute this property represents, defaults to kebap-cased property name.
 */
export interface PropertyOptions {
  mutable?: boolean;
  notify?: boolean;
  sync?: "init" | "attr" | "prop" | "both" | "none";
  parser?: ((val: string | boolean, cls: any, prop: string | symbol, type: Function) => any);
  serializer?: ((val: any, cls: any, prop: string | symbol, type: Function) => string | boolean);
  type?: Function;
  rerender?: boolean;
  attribute?: string;
}

export const DefaultPropertyOptions: PropertyOptions = {
  mutable: false,
  notify: false,
  sync: "init",
  rerender: true
};

export function defaultPropertyAttributeName(property: string) {
  return toKebapCase(property);
}

/**
 * Defines a property that can be set by an attribute or be reflected to an attribute.
 * It can be configured by providing an options object.
 * @param {PropertyOptions} [opts]
 * @decorator
 */
export function Prop(opts?: PropertyOptions): PropertyDecorator {
  return function<T>(target, propertyKey) {
    const options = Object.assign({},
      DefaultPropertyOptions,
      {
        attribute: defaultPropertyAttributeName(propertyKey),
        type: Reflect.getMetadata("design:type", target, propertyKey),
        parser: defaultAttributeProcessor("parser"),
        serializer: defaultAttributeProcessor("serializer"),
      }, opts);
    if (!target[PROPERTY_TYPES]) target[PROPERTY_TYPES] = {};
    target[PROPERTY_TYPES][propertyKey] = options.type;
    addExtension(target, new PropertyExtension(options, propertyKey));
  }
}

export class PropertyExtension implements ComponentExtension<Webcomponent> {

  observedAttributes: string[];
  observedProperties: (string | symbol)[];

  constructor(private opts: PropertyOptions, private property: string | symbol) {
    this.observedAttributes = ["attr","both"].indexOf(this.opts.sync) != -1 ? [this.opts.attribute] : [];
    this.observedProperties = ["prop","both"].indexOf(this.opts.sync) != -1 ? [this.property] : [];
  }

  connect(cls: Constructor<Webcomponent>, instance: Webcomponent) {
    if (["init","attr","both"].indexOf(this.opts.sync) == -1) return;
    if (instance.hasAttribute(this.opts.attribute)) {
      const val = instance.getAttribute(this.opts.attribute);
      const type = this.opts.type;
      instance[this.property] = this.opts.parser(val, cls, this.property, type);
      if (this.opts.notify)
        instance.dispatchEvent(new NotifyEvent(instance[this.property], undefined, Stages.PROPERTY));
    }
  }

  afterPropertyChange(cls: Constructor<Webcomponent>, instance: Webcomponent, key: string | symbol, oldVal: any, newVal: any) {
    const type = this.opts.type;
    const val = this.opts.serializer(newVal, cls, key, type);
    if (val == null || val === false)
      instance.removeAttribute(this.opts.attribute);
    else
      instance.setAttribute(this.opts.attribute, val == true ? this.opts.attribute : val as string);
    if (this.opts.notify)
      instance.dispatchEvent(new NotifyEvent(newVal, oldVal, Stages.PROPERTY));
  }

  afterAttributeChange(cls: Constructor<Webcomponent>, instance: Webcomponent, key: string, oldVal: string, newVal: string) {
    const val = instance.getAttribute(this.opts.attribute);
    const type = this.opts.type;
    instance[this.property] = this.opts.parser(val, cls, this.property, type);
  }
}
