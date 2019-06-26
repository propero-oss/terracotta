import {IModel} from "../../types";

/**
 * @typedef ModelOptions
 * @property {string|IModel} [model=""] The model to reflect to and from.
 * @property {string} [path="/"] The path in the model to reflect to and from.
 * @property {boolean} [rerender=true] If set to true, the component will be re-rendered upon changes to this property.
 */
export interface ModelOptions<MType> {
  model?: string | IModel<MType>;
  path?: string;
  rerender?: boolean;
}

export const DefaultModelOptions: ModelOptions<any> = {
  model: '',
  path: '/',
  rerender: true
};

/**
 * Defines a property that is a proxy to a property in a model.
 * Whenever the value of this property changes, the changes are reflected to the model and vice versa.
 * It can be configured by providing an options object.
 * @param {ModelOptions} [opts]
 * @decorator
 */
export function Model<MType>(opts?: ModelOptions<MType>): PropertyDecorator {
  return function<T>(target, propertyKey) {
    const options = Object.assign({}, DefaultModelOptions, opts);
  }
}
