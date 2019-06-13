import {LOCKS, Stage} from "../constants";


export function lock(instance: any, property: string | symbol, stage: Stage) {
  if (!instance[LOCKS]) instance[LOCKS] = {};
  instance[LOCKS][property] = stage;
}

export function unlock(instance: any, property: string | symbol) {
  if (!instance[LOCKS]) return;
  delete instance[LOCKS][property];
}

export function locked(instance: any, property: string | symbol): Stage | undefined {
  return instance[LOCKS] && instance[LOCKS][property];
}
