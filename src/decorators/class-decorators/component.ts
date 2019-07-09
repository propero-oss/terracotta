import {Webcomponent, Constructor} from "@/types";
import {toKebapCase} from "@/util";
import {getExtensions, createWebcomponentAttributes, createTerraAttributes} from "@/component";
import {element} from "@/render";

/**
 * @typedef ComponentOptions
 * @property shadow If this is set to true, rendering will be done inside of a shadow root element instead of the element itself
 * @property mode What mode the shadow root will be created with. An open shadow root is accessible from the outside. A closed one isn’t.
 * @property delegatesFocus Whether or not the element delegates focus to its children. This option has no effect if shadow is false.
 * @property tag The tag name to register the web component under. If none is defined, the class name converted to kebap-case and stipped of HTML prefix and Element suffix will be used.
 * @property registry the registry to register the tag in.
 */
export interface ComponentOptions {
  shadow?: boolean;
  mode?: "open" | "closed";
  delegatesFocus?: boolean;
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


/**
 * Defines a class as a web component. It accepts an options object to configure the component.
 * @param {ComponentOptions} [opts]
 * @decorator
 */
export function Component<T>(opts?: ComponentOptions): <T>(target: Constructor<T>) => Constructor<T & Webcomponent> {
  return function<T>(target: Constructor<T>): Constructor<T & Webcomponent> {
    const options = Object.assign({}, DefaultComponentOptions, {tag: defaultTagNameForClass(target)}, opts);

    const extensions = getExtensions(target);

    createWebcomponentAttributes(target, options, extensions);
    createTerraAttributes(target);

    extensions
      .filter(extension => extension.register)
      .forEach(extension => extension.register(target));

    options.registry.define(options.tag, target, options.opts);
    console.log(`Registered ${target.name} as ${options.tag}!`);

    return target as unknown as Constructor<T & Webcomponent>;
  }
}

export declare namespace Component {
  export let render: typeof element;
}

Component.render = element;
