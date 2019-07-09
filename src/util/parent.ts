
/**
 * @typedef ParentFindOptions
 * @property {string} [selector] The selector to match parent elements against. If it isn’t set, the first level parent will always be used instead.
 * @property {boolean} [walkDom=false] Instead of using the closest method, use parentNode recursively until it either matches the selector or is null or undefined. Useful for traversing out of shadow dom trees.
 * @property {number} [levels] The maximum amount of levels to traverse. This option only has an effect if walkDom is set to true.
 */
export interface ParentFindOptions {
  selector?: string;
  walkDom?: boolean;
  levels?: number;
}

/**
 * Get a specific parent element of another element.
 * @param element The element to use as a base
 * @param options The options for how to traverse the dom
 */
export function getParentOf(element: HTMLElement, options: ParentFindOptions = {}): HTMLElement {
  if (!options.selector) return element.parentNode as HTMLElement;
  if (!options.walkDom) return element.closest(options.selector) as HTMLElement;
  return walkDom(element, options.selector, options.levels || Infinity);
}

function walkDom(el: HTMLElement, selector: string, levels: number) {
  while (levels-- && (el = parentOf(el) as HTMLElement))
    if (el.matches(selector))
      return el;
}

function isShadowRoot(el: Node & ParentNode): el is ShadowRoot {
  return el && "host" in el;
}

function parentOf(el: Node): Node & ParentNode {
  const parent = el.parentNode;
  if (isShadowRoot(parent)) return parent.host;
  return parent;
}
