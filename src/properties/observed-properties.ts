import {Constructor} from "@/types";
import {ComponentExtension} from "@/component";
import {PROPERTIES, Stages} from "@/constants";
import {lock, locked, unlock} from "./lock";

export function createAccessors(target: Constructor<any>, extensions: ComponentExtension<any>[], properties: (string | symbol)[]) {
  properties.forEach(prop => {
    const relevant = extensions.filter(extension => extension.observedProperties.indexOf(prop) != -1);
    Object.defineProperty(target.prototype, prop, {
      get() {
        if (!this[PROPERTIES]) this[PROPERTIES] = {};
        return this[PROPERTIES][prop];
      },
      set(val: any) {
        if (!this[PROPERTIES]) this[PROPERTIES] = {};

        if (locked(this, prop) === Stages.PROPERTY) {
          this[PROPERTIES][prop] = val;
          return;
        }

        lock(this, prop, Stages.PROPERTY);

        const before = this[prop];
        val = relevant.reduce((val, ext) => !ext.beforePropertyChange ? val : ext.beforePropertyChange(target, this, prop, before, val), val);
        this[PROPERTIES][prop] = val;
        relevant.forEach(ext => ext.afterPropertyChange && ext.afterPropertyChange(target, this, prop, before, val));

        unlock(this, prop);
      }
    });
  });
}
