

export const defaultParseMap: Record<string, {parser: (val: any, cls, prop, type) => any, serializer: (val: any, cls, prop, type) => any}> = {};
export function registerParser(type: Function, parser: (val: any, cls, prop, type) => any, serializer: (val: any, cls, prop, type) => any) {
  defaultParseMap[type.name] = {
    parser,
    serializer
  };
}
export function getParser(type: Function) {
  return defaultParseMap[type.name];
}

registerParser(String,
  val => val != null ? val : undefined,
  val => val
);
registerParser(Number,
  val => val != null ? +val : undefined,
  val => `${val}`
);
registerParser(Boolean,
  val => !!val && val != "false",
  val => val
);
registerParser(Date,
  val => val ? new Date(val as string) : undefined,
  val => val ? (val as Date).toISOString() : undefined
);
registerParser(RegExp,
  val => val ? new RegExp(val as string) : undefined,
  val => val ? (val as RegExp).source : undefined
);

export function defaultAttributeProcessor(kind: "parser" | "serializer") {
  return function(val: any, cls: any, prop: string | symbol, type: Function) {
    const processors = getParser(type);
    if (processors) return processors[kind](val, cls, prop, type);
    throw new TypeError(`No ${kind} registered for type ${type.name}.`);
  }
}
