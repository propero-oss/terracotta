export const Stages = {
  PROPERTY: "PROPERTY",
  ATTRIBUTE: "ATTRIBUTE"
};
export type Stage = typeof Stages[keyof typeof Stages];
