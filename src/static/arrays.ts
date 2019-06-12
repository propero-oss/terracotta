

export function distinct(transformer?: (val: any) => any): (val: any) => boolean {
  const elements = [];
  return (val => {
    if (transformer) val = transformer(val);
    if (elements.indexOf(val) != -1) return false;
    elements.push(val);
    return true;
  });
}
