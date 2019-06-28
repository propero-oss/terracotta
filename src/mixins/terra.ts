import {Constructor, Webcomponent} from "@/types";
import {addExtension, getExtensions} from "@/component";

export function Terra<T extends HTMLElement, K>(cls?: Constructor<T>, ...mixins: Constructor<K>[]): Constructor<T & K & Webcomponent> {

  // @ts-ignore
  const target = class extends (cls || HTMLElement) {};
  mixins.forEach(mixin => {
    Object.assign(target, mixin); // Static
    Object.assign(target.prototype, mixin.prototype); // Member
    getExtensions(mixin).forEach(ext => addExtension(target, ext));
  });

  return target as Constructor<T & K & Webcomponent>;
}

