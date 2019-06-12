import {Webcomponent} from "../../types/webcomponent";
import {Constructor} from "../../types/constructor";
import {toKebapCase} from "../../util";
import {h} from "../../static";
import {getExtensions} from "../../component/extension";

/**
 * @typedef ComponentOptions
 * @property {boolean} [shadow=false] If this is set to true, rendering will be done inside of a shadow root element instead of the element itself
 * @property {'open'|'closed'} [mode='open'] What mode the shadow root will be created with. An open shadow root is accessible from the outside. A closed one isn’t.
 * @property {string} [tag] The tag name to register the web component under. If none is defined, the class name converted to kebap-case and stipped of HTML prefix and Element suffix will be used.
 * @property {CustomElementRegistry} [registry] the registry to register the tag in.
 */
export interface ComponentOptions {
  shadow?: boolean;
  mode?: "open" | "closed";
  tag?: string;
  registry?: CustomElementRegistry,
  opts?: ElementDefinitionOptions,
}

export const DefaultComponentOptions: ComponentOptions = {
  shadow: false,
  mode: "open",
  registry: window.customElements,
};

export function defaultTagNameForClass(target: Constructor<any>) {
  return toKebapCase(target.name).replace(/^html-/,'').replace(/-element$/, '');
}

export interface Component<T> {
  (opts?: ComponentOptions): <T>(target: Constructor<T>) => Constructor<T & Webcomponent>;
  render: typeof h;
}

/**
 * Defines a class as a web component. It accepts an options object to configure the component.
 * @param {ComponentOptions} [opts]
 * @decorator
 */
export function Component<T>(opts?: ComponentOptions): <T>(target: Constructor<T>) => Constructor<T & Webcomponent> {
  return function<T>(target: Constructor<T>): Constructor<T & Webcomponent> {
    const options = Object.assign({}, DefaultComponentOptions, {tag: defaultTagNameForClass(target)}, opts);

    getExtensions(target)
      .filter(extension => extension.register)
      .forEach(extension => extension.register(target));
    options.registry.define(options.tag, target, options.opts);



    return target as unknown as Constructor<T & Webcomponent>;
  }
}

Component.render = h;
