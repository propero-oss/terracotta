import {delta, normalizeAttributes} from "@/static";
import {Constructor} from "@/types";
import domdiff from "domdiff";

const slice = Array.prototype.slice.call.bind(Array.prototype.slice);

export interface RenderTemplate {
  render(el: HTMLElement): HTMLElement;
  tag: string | Function
  key: any
}


export function element(type: string | Function, attributes: any, ...children: any[]): RenderTemplate {
  return {
    tag: type,
    key: attributes.key != null ? attributes.key : type + '#' + attributes.id,
    render(el) {
      if (!el) el = createElement(this.type);
      replaceAttributes(el, normalizeAttributes(attributes));
      replaceChildren(el, children);
      return el as HTMLElement;
    }
  };
}


export function createElement(type: string | Constructor<any>) {
  return typeof type === "string" ? document.createElement(type) : new type();
}

export function replaceAttributes(el: HTMLElement, attributes: any) {
  const { removed, added, same } = delta(el.getAttributeNames(), Object.keys(attributes));

  removed.forEach(el.removeAttribute.bind(el));
  added.forEach(key => el.setAttribute(key, attributes[key]));
  same.filter(key => el.getAttribute(key) != attributes[key])
      .forEach(key => el.setAttribute(key, attributes[key]));
}


export function replaceChildren(el: HTMLElement, children: any[]) {

  const total = children.length;
  const before = slice(el.children).map(el => ({key: keyOf(el), el}));
  const after = [];

  let pAfter: any;
  let pBefore: any;
  let offset = 0;

  for (let i = 0; i < total; ++i) {
    pBefore = before[i + offset];
    pAfter = children[i];

    if (!pBefore) {
      after.push(pAfter.render());
      continue;
    }

    if (isSameElement(pBefore, pAfter)) {
      after.push(replaceSame(pBefore, pAfter));
      continue;
    }

    offset -= getAddedElements(pBefore, children, i, after);

    offset += getRemovedElements(pAfter, before, i + offset, after);
  }

  domdiff(el, before, after);
}

export function isSameElement(el1: any, el2: any): boolean {
  return keyOf(el1) === keyOf(el2);
}

export function replaceSame(el1: any, el2: any) {
  return el2.render(el1);
}

export function keyOf(el: any): any {
  return el.key != null ? el.key : el.tagName + '#' + el.id;
}

function getAddedElements(pBefore: any, after: any[], afterOffset: number, result: any[]) {
  let pAfter: any;

  for (let i = 0; i + afterOffset < after.length; ++i) {
    pAfter = after[i + afterOffset];
    if (isSameElement(pBefore, pAfter)) {
      const parts = slice(after, afterOffset, i - 1);
      parts.push(replaceSame(pBefore, pAfter));
      result.push(...parts);
      return i;
    }
  }

  return 0;
}

function getRemovedElements(pAfter: any, before: any[], beforeOffset: number, result: any[]) {
  let pBefore: any;

  for (let i = 0; i + beforeOffset < before.length; ++i) {
    pBefore = before[beforeOffset + i];
    if (isSameElement(pBefore, pAfter)) {
      result.push(replaceSame(pBefore, pAfter));
      return i;
    }
  }

  return 0;
}
