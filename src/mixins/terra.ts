import {Constructor, Webcomponent} from "@/types";
import {addExtension, getExtensions} from "@/component";

type x = Record<any, any>;

/**
 * Utility function to apply terracotta mixins and provide proper type hints for extending classes.
 * This is necessary because at the time of writing this, class decorators cannot modify the decorated class' typing.
 * It merges every static and instance member of any given mixins and applies any mixin extensions to the target class.
 * @param cls The base class to extend
 * @param mixins A list of Terracotta mixins
 * @mixin
 */
export function Terra<T extends HTMLElement, K>(cls?: Constructor<T>, ...mixins: K[]): Constructor<T & Webcomponent> & K {

  const ext = cls || HTMLElement;

  // @ts-ignore
  const target = class extends ext {};

  mixins.forEach(mixin => {
    mergePrototypes(mixin, target);
    mergeClasses(mixin, target);
    getExtensions(mixin).forEach(ext => addExtension(target, ext));
  });

  return target as Constructor<T & Webcomponent> & K;
}

export function mergePrototypes(source, target) {
  allPrototypes(source).forEach(proto => copyDescriptors(proto, target.prototype));
}

export function copyDescriptors(source, target) {
  const descriptors = Object.getOwnPropertyDescriptors(source);
  if (typeof source === "function") {
    delete descriptors.name;
  }
  delete descriptors.__proto__;
  delete descriptors.prototype;
  delete descriptors.constructor;
  Object.entries(descriptors).forEach(([key, descriptor]) => {
    Object.defineProperty(target, key, descriptor);
  });
}

export function mergeClasses(source, target) {
  allClasses(source).forEach(cls => copyDescriptors(cls, target));
}

export function allClasses(target) {
  const prototypes = [];
  let current = target.prototype;
  do {
    prototypes.push(current);
  } while ((current = Object.getPrototypeOf(current)) && current !== Object.prototype);
  return prototypes
    .map(proto => proto.constructor)
    .filter(cls => cls)
    .reverse();
}

export function allPrototypes(target) {
  const prototypes = [];
  let current = target.prototype;
  do {
    prototypes.push(current);
  } while ((current = Object.getPrototypeOf(current)) && current !== Object.prototype);
  return prototypes.reverse();
}
