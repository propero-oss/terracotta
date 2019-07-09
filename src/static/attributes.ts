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
    case "object": return Array.isArray(attr) ? attr.join(';') : Object.keys(attr).filter( key => null != attr[key]).map(key => `${toKebapCase(key)}:${attr[key]}`).join(';');
    case "function": return styleString(attr());
    case "undefined": return "";
    case "boolean": return "";
    default: return String(attr);
  }
}

export function membersToPrefixedAttributes(target: any, attrs: any, member: string, prefix: string = member) {
  if (member in attrs && typeof attrs[member] === "object") {
    Object.keys(attrs[member]).forEach(key => target[`${prefix}-${toKebapCase(key)}`] = attrs[member][key]);
  }
}

export function normalizeAttributes(attrs: any): any {
  const copy = {...attrs};
  if ("class" in attrs) copy.class = classString(attrs.class);
  if ("style" in attrs) copy.style = styleString(attrs.style);
  membersToPrefixedAttributes(copy, attrs, "data");
  membersToPrefixedAttributes(copy, attrs, "aria");
  delete copy.data;
  delete copy.aria;
  return copy;
}
