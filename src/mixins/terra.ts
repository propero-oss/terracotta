import {Constructor, Webcomponent} from "@/types";
import {addExtension, getExtensions} from "@/component";

/**
 * Utility function to apply terracotta mixins and provide proper type hints for extending classes.
 * This is necessary because at the time of writing this, class decorators cannot modify the decorated class' typing.
 * It merges every static and instance member of any given mixins and applies any mixin extensions to the target class.
 * @param cls The base class to extend
 * @param mixins A list of Terracotta mixins
 * @mixin
 */
export function Terra<T extends HTMLElement, K>(cls?: Constructor<T>, ...mixins: Constructor<K>[]): Constructor<T & K & Webcomponent> {

  const ext = cls || HTMLElement;

  // @ts-ignore
  const target = class extends ext {};

  mixins.forEach(mixin => {
    Object.assign(target, mixin);
    Object.assign(target.prototype, mixin.prototype);
    getExtensions(mixin).forEach(ext => addExtension(target, ext));
  });

  return target as Constructor<T & K & Webcomponent>;
}
