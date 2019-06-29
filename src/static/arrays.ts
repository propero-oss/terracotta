

export function distinct(transformer?: (val: any) => any): (val: any) => boolean {
  const elements = [];
  return (val => {
    if (transformer) val = transformer(val);
    if (elements.indexOf(val) != -1) return false;
    elements.push(val);
    return true;
  });
}


export function flatten<T>(arrays: T[][]): T[] {
  return arrays.reduce((all, one) => all.concat(one), []);
}


export function flattenAttribute<T, K extends keyof T, A extends T[K]>(source: T[], property: T[K] extends Array<any> ? K : never): A {
  // @ts-ignore
  return flatten(source.filter(one => one[property] && one[property].length).map(one => one[property]))
}
