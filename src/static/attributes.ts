import {toKebapCase} from "@/util";


export function classString(attr: any): string {
  switch (typeof attr) {
    case "string": return attr;
    case "object": return Array.isArray(attr) ? attr.join(' ') : Object.keys(attr).filter(key => !!attr[key]).join(' ');
    case "function": return classString(attr());
    case "undefined": return "";
    case "boolean": return "";
    default: return String(attr);
  }
}

export function styleString(attr: any): string {
  switch (typeof attr) {
    case "string": return attr;
    case "object": return Array.isArray(attr) ? attr.join(';') : Object.keys(attr).filter( key => !!attr[key]).map(key => `${toKebapCase(key)}:${attr[key]}`).join(' ');
    case "function": return styleString(attr());
    case "undefined": return "";
    case "boolean": return "";
    default: return String(attr);
  }
}

export function normalizeAttributes(attrs: any): any {
  const copy = {...attrs};
  if ("class" in attrs) copy.class = classString(attrs.class);
  if ("style" in attrs) copy.style = styleString(attrs.style);
  if ("data" in attrs && typeof attrs.data == "object") {
    Object.keys(attrs.data).forEach(key => copy[`data-${toKebapCase(key)}`] = attrs.data[key]);
    delete copy.data;
  }
  if ("aria" in attrs && typeof attrs.aria == "object") {
    Object.keys(attrs.aria).forEach(key => copy[`aria-${toKebapCase(key)}`] = attrs.aria[key]);
    delete copy.aria;
  }
  return copy;
}
