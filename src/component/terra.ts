import {IModel, Webcomponent} from "@/types";
import {h, mergeObjects} from "@/static";
import {MODELS} from "@/constants";
import {replaceChildren} from "@/render";


export function createTerraAttributes(target: any) {
  createTerraRequestRerender(target);
  createTerraGetModel(target);
  createTerraSetModel(target);
  createTerraGetAttributes(target);
  createTerraSetAttributes(target);
  createTerraGetProperties(target);
  createTerraSetProperties(target);
}

export function createTerraGetModel(target: any) {
  createInstanceMethod(target, "getModel", staticToInstance(getModelOf));
}

export function createTerraSetModel(target: any) {
  createInstanceMethod(target, "setModel", staticToInstance(setModelOf));
}

export function createTerraGetAttributes(target: any) {
  createInstanceMethod(target, "_getAttributes", staticToInstance(getAttributesOf));
}

export function createTerraSetAttributes(target: any) {
  createInstanceMethod(target, "_setAttributes", staticToInstance(setAttributesOf));
}

export function createTerraGetProperties(target: any) {
  createInstanceMethod(target, "_getProperties", staticToInstance(getPropertiesOf));
}

export function createTerraSetProperties(target: any) {
  createInstanceMethod(target, "_setPropertiesOf", staticToInstance(setPropertiesOf));
}

export function createTerraRequestRerender(target: any) {
  createInstanceMethod(target, "_requestRerender", async function() {
    const root = this.hostElementRoot;
    renderTemplate(this.render(h), root);
  });
}


export function createInstanceMethod(target: any, name: string, method: (this: Webcomponent, ...args: any[]) => any) {
  Object.defineProperty(target.prototype, name, {value: method});
}

export function staticToInstance<T extends Function>(fn: T) {
  return fn.call.bind(fn);
}

export function getModelsOf(instance: any, create: boolean = false) {
  if (instance[MODELS]) return instance[MODELS];
  if (create) return instance[MODELS] || (instance[MODELS] = {});
  return {};
}

function mergeModelsOf(instance: any) {
  const models: Record<string, IModel<any>>[] = [];
  let current = instance;
  do {
    const mapping = getModelsOf(current);
    if (mapping) models.push(mapping);
  } while((current = Object.getPrototypeOf(current)) != Object && current);
  return mergeObjects(models);
}

export function setModelOf(instance: any, model: IModel<any>, name?: string) {
  const models = getModelsOf(instance, true);
  models[name || ""] = model;
  return instance;
}

export function getModelOf(instance: any, name?: string) {
  const models = mergeModelsOf(instance);
  return models[name || ""];
}

function createAssigner(fetcher: (...args: any[]) => any, applier: (...args: any[]) => any): (...args: any) => any {
  return function assigner(instance: any, propsOrFn: any) {
    if (typeof propsOrFn === "function")
      propsOrFn = propsOrFn(fetcher(instance));
    if ("then" in propsOrFn)
      propsOrFn.then(props => assigner(instance, props));
    else
      applier(instance, propsOrFn);
    return instance;
  };
}


export function getAttributesOf<T extends HTMLElement, K extends string>(instance: T, names: K[] = instance.getAttributeNames() as any): Record<K, string | boolean> {
  let map: any = {};
  for (let name of names)
    map[name] = instance.getAttribute(name as string);
  return map;
}

interface AttributeSetter {
  <T extends HTMLElement>(instance: T, newAttrs: Record<string, string | boolean>): T;
  <T extends HTMLElement>(instance: T, mutator: (props: Record<string, string | boolean>) => Record<string, string | boolean>): T;
  <T extends HTMLElement>(instance: T, mutator: (props: Record<string, string | boolean>) => Promise<Record<string, string | boolean>>): T;
}

export const setAttributesOf: AttributeSetter = createAssigner(getAttributesOf, setAttrs);

function setAttrs(instance: any, attrs: Record<string, string | boolean>) {
  for (let entry of Object.entries(attrs)) {
    if (!entry[1])
      instance.removeAttribute(entry[0]);
    else
      // @ts-ignore
      instance.setAttribute(...entry);
  }
}


export function getPropertiesOf<T, K extends keyof T>(instance: T, names: K[] = Object.keys(instance) as any): Record<K, T[K]>{
  let map: any = {};
  for (let name of names)
    map[name] = instance[name];
  return map;
}

interface PropertySetter {
  <T, K extends keyof T>(instance: T, newProps: Record<K, T[K]>): T;
  <T, K extends keyof T>(instance: T, mutator: (props: Record<K, T[K]>) => Record<K, T[K]>): T;
  <T, K extends keyof T>(instance: T, mutator: (props: Record<K, T[K]>) => Promise<Record<K, T[K]>>): T;
}

export const setPropertiesOf: PropertySetter = createAssigner(getPropertiesOf, setProps);

function setProps(instance: any, props: Record<string, any>) {
  for (let entry of Object.entries(props))
    instance[entry[0]] = entry[1];
}


export function renderTemplate(template: any, target: any) {
  if (Array.isArray(template))
    replaceChildren(target, template);
  else
    replaceChildren(target, [template]);
}
