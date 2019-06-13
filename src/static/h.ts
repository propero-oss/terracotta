import {normalizeAttributes} from "./attributes";

/**
 * This function is used for JSX expressions.
 * It will be passed to render methods as their first argument for utility.
 * @param element
 * @param attributes
 * @param children
 */
export function h(element: string|Function, attributes: {[key: string]: any} = {}, children: any[] = []) {
  const el = typeof element == 'string' ? document.createElement(element) : new (element as any)();
  Object.assign(el, normalizeAttributes(attributes));
  children.forEach(el.appendChild.bind(el));
  return el;
}
