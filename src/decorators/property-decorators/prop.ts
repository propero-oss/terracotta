import {toKebapCase} from "../../util";

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
  parser?: ((val: string | boolean) => any);
  serializer?: ((val: any) => string | boolean);
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
    const options = Object.assign({}, DefaultPropertyOptions, {attribute: defaultPropertyAttributeName(propertyKey)}, opts);
  }
}
