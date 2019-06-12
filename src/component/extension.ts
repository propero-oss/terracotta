import {Constructor, Webcomponent} from "../types";
import "reflect-metadata";
import {TERRACOTTA} from "../constants";
import {distinct} from "../static";

export interface ComponentExtension<T extends Webcomponent> {
  register?(cls: Constructor<T>);
  construct?(cls: Constructor<T>, instance: T);
  connect?(cls: Constructor<T>, instance: T);
  beforePropertyChange?(cls: Constructor<T>, instance: T, key: string, oldVal: any, newVal: any, stage: string);
  afterPropertyChange?(cls: Constructor<T>, instance: T, key: string, oldVal: any, newVal: any, stage: string);
  beforeAttributeChange?(cls: Constructor<T>, instance: T, key: string, oldVal: string, newVal: string, stage: string);
  afterAttributeChange?(cls: Constructor<T>, instance: T, key: string, oldVal: string, newVal: string, stage: string);
  beforeRender?(cls: Constructor<T>, instance: T);
  afterRender?(cls: Constructor<T>, instance: T);
  disconnect?(cls: Constructor<T>, instance: T);
  destroy?(cls: Constructor<T>, instance: T);

  observedAttributes?: string[];
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
  return mergeExtensions(target)
    .filter(ext => ext.observedAttributes)
    .map(ext => ext.observedAttributes)
    .reduce((all, one) => all.concat(one), [])
    .filter(distinct())
}