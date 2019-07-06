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

  const before = slice(el.children).map(el => ({ key: keyOf(el), el }));
  const after = [];
  const total = children.length;
  let offset = 0;

  for (let i = 0; i < total; ++i) {
    let pbefore = before[i + offset];
    let pafter = children[i];

    if (!pbefore) {
      after.push(pafter.render());
      continue;
    }

    if (pbefore.key === pafter.key) {
      after.push(pafter.render(before[i + offset].el));
      continue;
    }

    let offsetDelta = 0, found = false;
    do { // Removed
      pbefore = before[i + offset + ++offsetDelta];
      if (pbefore.key === pafter.key) {
        offset += offsetDelta;
        after.push(pafter.render(pbefore.el));
        found = true;
        break;
      }
    } while(offsetDelta++ + offset + i < total);

    if (found) continue;

    pbefore = before[i + offset];

    offsetDelta = 0;
    found = false;
    do { // Added
      pafter = children[i + offsetDelta];
      if (pbefore.key === pafter.key) {
        for (let y = 1; y < offsetDelta; ++y)
          after.push(children[i + y - 1].render());
        after.push(pafter.render(pbefore));
        offset -= offsetDelta;
        found = true;
        break;
      }
    } while (offset - offsetDelta++ + i >= 0);

    if (found) continue;

    throw new RangeError("WHAT THE FUCK IS GOING ON?");
  }

  domdiff(el, before, after);
}

export function keyOf(el: any): any {
  return el.key != null ? el.key : el.tagName + '#' + el.id;
}
