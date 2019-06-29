import {IModel} from "./IModel";


export interface Webcomponent extends HTMLElement {
  //<editor-fold desc="Hooks">
  /**
   * Attributes for the host element, styles, classes, etc.
   */
  hostData?: any;

  /**
   * The host element or shadow root to render to.
   */
  hostElementRoot?: HTMLElement | ShadowRoot;

  /**
   * Render the component using JSX and the provided static function h()
   * @param {Function} h The JSX render function
   */
  render?(h:any): any;

  /**
   * Called once an attribute of the host element changes. Should never modify the attribute values.
   * @param {string} attr The modified attribute
   * @param {any} newVal The new value
   * @param {any} oldVal The old value
   */
  onAttributeChanged?(attr: string, newVal: any, oldVal: any);

  /**
   * Called every time an element is upgraded to a web component.
   */
  onConnected?();

  /**
   * Called every time an element is destroyed or removed from the dom without remaining references.
   */
  onDisconnected?();

  /**
   * Called every time an element is moved to a new document
   */
  onAdopted?();

  /**
   * Called before every component render.
   */
  onBeforeRendering?();

  /**
   * Called after every component render
   */
  onAfterRendering?();
  //</editor-fold>
  //<editor-fold desc="Methods">
  /**
   * Set a model for all @IModel bound properties in this component and all child components.
   * @param {IModel} model The model to bind.
   * @param {string} [name=''] The name to bind the model under.
   */
  setModel(model: IModel<any>, name?: string): this;

  /**
   * Get a previously set model if it exists.
   * @param {string} [name='']
   */
  getModel(name?: string): IModel<any>;

  /**
   * Get all properties of this component mapped to their respective values.
   * @private
   */
  _getProperties(): {[key: string]: any};

  /**
   * Set all given properties to the given respective values. A function can also be given as an argument.
   * It will be called with all properties of this component and its return value can be either a Promise of, or a subset of these properties mapped to a new value.
   * @param {Function|Object} newProps
   * @private
   */
  _setProperties(newProps: {[key: string]: any}): this;
  _setProperties(mutator: (properties: {[key: string]: any}) => {[key: string]: any} | Promise<{[key: string]: any}>): this;

  /**
   * Get all properties of this component mapped to their respective values.
   * @private
   */
  _getAttributes(): {[key: string]: string | boolean};

  /**
   * Set all given attributes to the given respective values.
   * A function can also be given as an argument.
   * It will be called with all attributes of this component and its return value can be either a Promise of, or a subset of these attributes mapped to a new value.
   * @param {Function|Object} newAttrs
   * @private
   */
  _setAttributes(newAttrs: {[key: string]: string | boolean}): this;
  _setAttributes(mutator: (properties: {[key: string]: string | boolean}) => {[key: string]: string | boolean} | Promise<{[key: string]: string | boolean}>): this;


  /**
   * Request re-rendering the component
   */
  _requestRerender(): void;
  //</editor-fold>


}
