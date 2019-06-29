import "reflect-metadata";
import {Constructor, Webcomponent} from "@/types";
import {TERRACOTTA} from "@/constants";
import {distinct, flattenAttribute} from "@/static";

export interface ComponentExtension<T extends Webcomponent> {
  register?(cls: Constructor<T>);
  construct?(cls: Constructor<T>, instance: T);
  connect?(cls: Constructor<T>, instance: T);
  beforePropertyChange?(cls: Constructor<T>, instance: T, key: string | symbol, oldVal: any, newVal: any): any;
  afterPropertyChange?(cls: Constructor<T>, instance: T, key: string | symbol, oldVal: any, newVal: any);
  beforeAttributeChange?(cls: Constructor<T>, instance: T, key: string, oldVal: string, newVal: string): any;
  afterAttributeChange?(cls: Constructor<T>, instance: T, key: string, oldVal: string, newVal: string);
  beforeRender?(cls: Constructor<T>, instance: T);
  afterRender?(cls: Constructor<T>, instance: T);
  adopt?(cls: Constructor<T>, instance: T);
  disconnect?(cls: Constructor<T>, instance: T);
  destroy?(cls: Constructor<T>, instance: T);

  observedAttributes?: string[];
  observedProperties?: (string | symbol)[];
}


export function addExtension(target: any, extension: ComponentExtension<any>) {
  if (Reflect.hasOwnMetadata(TERRACOTTA, target)) {
    const metadata = Reflect.getOwnMetadata(TERRACOTTA, target);
    if (!metadata.extensions) metadata.extensions = [extension];
    else metadata.extensions.push(extension);
  } else {
    Reflect.defineMetadata(TERRACOTTA, {
      extensions: [extension]
    }, target);
  }
}

export function getExtensions(target: any): ComponentExtension<any>[] {
  return mergeExtensions(target);
}

export function mergeExtensions(target: any): ComponentExtension<any>[] {
  const prototypeMeta : ComponentExtension<any>[] = [];
  let current: any = target;
  do {
    const meta = Reflect.getOwnMetadata(TERRACOTTA, current);
    if (meta && meta.extensions) prototypeMeta.push(...meta.extensions);
  } while ((current = Object.getPrototypeOf(current)) != Object && current);
  return prototypeMeta;
}

export function mergeObservedAttributes(target: any): string[] {
  return flattenAttribute(mergeExtensions(target), "observedAttributes").filter(distinct());
}

export function mergeObservedProperties(target: any): (string | symbol)[] {
  return flattenAttribute(mergeExtensions(target), "observedProperties").filter(distinct());
}
