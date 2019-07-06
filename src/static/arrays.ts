

export function distinct(transformer?: (val: any) => any): (val: any) => boolean {
  const elements = [];

  if (!transformer) return (val => {
    if (elements.indexOf(val) != -1) return false;
    elements.push(val);
    return true;
  });

  else return (val => {
    val = transformer(val);
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


export function mergeObjects<T>(array: T[]): T {
  return Object.assign({}, ...array);
}

export function delta<T>(arr1: T[], arr2: T[]): ({ added: T[], removed: T[], same: T[] }) {

  const all = [...arr1, ...arr2].filter(distinct());
  const res = {
    added: [],
    removed: [],
    same: []
  };

  for (const one of all) {
    const has1 = arr1.indexOf(one) != -1;
    const has2 = arr2.indexOf(one) != -1;
    if (has1 && has2) res.same.push(one);
    else if (has1) res.removed.push(one);
    else res.added.push(one);
  }

  return res;
}
