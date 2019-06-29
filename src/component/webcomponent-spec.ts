import {ComponentExtension, getExtensions, mergeObservedAttributes, mergeObservedProperties} from "@/component";
import {Webcomponent} from "@/types";
import {createAccessors, lock, locked, unlock} from "@/properties";
import {Stages} from "@/constants";

/**
 * Create all necessary webcomponent attributes for Terracotta components.
 * @param target the class to extend
 * @param is the component tag name
 * @param extensions a list of extensions
 */
export function createWebcomponentAttributes(target: any, is: string, extensions: ComponentExtension<Webcomponent>[] = getExtensions(target)) {
  createIs(target, is);
  createObservedAttributes(target);
  createPropertyAccessors(target, extensions);
  createAttributeChangedCallback(target, extensions);
  createConnectedCallback(target, extensions);
  createDisconnectedCallback(target, extensions);
  createAdoptedCallback(target);
}

/**
 * Create the static 'observedAttributes' property as defined in the webcomponent specification
 * It collects all observed attributes listed in any extension of this component
 * @param target the class to define the static property for
 */
export function createObservedAttributes(target: any) {
  Object.defineProperty(target, 'observedAttributes', {value: mergeObservedAttributes(target)});
}

/**
 * Create the static 'is' property containing the tag name of the component for utility.
 * @param target the class to define the static property for
 * @param is the tag name of the component
 */
export function createIs(target: any, is: string) {
  Object.defineProperty(target, 'is', {value: is});
}

/**
 * Create reactive property accessors for any extension that requires them.
 * It collects all observed properties listed in any extension of this component and
 * notifies interested parties if changes to these properties occur.
 * It also forwards the method call to the Terracotta specific onPropertyChanged method if it exists.
 * @param target the class to define the accessors on
 * @param extensions a list of extensions.
 */
export function createPropertyAccessors(target: any, extensions: ComponentExtension<Webcomponent>[] = getExtensions(target)) {
  const propertyObserving = extensions.filter(extension =>
    extension.observedProperties && extension.observedProperties.length
    && (extension.afterPropertyChange || extension.beforePropertyChange));
  createAccessors(target, propertyObserving, mergeObservedProperties(target));
}

/**
 * Create the 'attributeChangedCallback' method as defined in the webcomponent specification.
 * It collects all observed attributes listed in any extension of this component and
 * notifies interested parties if changes to these attributes occur.
 * It also forwards the method call to the Terracotta specific onAttributeChanged method if it exists.
 * @param target the class to define the method on
 * @param extensions a list of extensions
 */
export function createAttributeChangedCallback(target: any, extensions: ComponentExtension<Webcomponent>[] = getExtensions(target)) {
  const interested: Record<string, ComponentExtension<Webcomponent>[]> = {};
  extensions
    .filter(ext => ext.observedAttributes && ext.observedAttributes.length)
    .forEach(ext => ext.observedAttributes.forEach(attr => (interested[attr] || (interested[attr] = []).push(ext))));

  Object.defineProperty(target.prototype, 'attributeChangedCallback', {
    value: function (this: Webcomponent, attr: string, oldVal: any, newVal: any) {
      const extensions = interested[attr];
      const orig = newVal;

      if (oldVal === newVal) return;
      if (!extensions || !extensions.length || locked(this, attr) === Stages.ATTRIBUTE) {
        if (this.onAttributeChanged) this.onAttributeChanged(attr, newVal, oldVal);
        return;
      }

      lock(this, attr, Stages.ATTRIBUTE);

      newVal = extensions
        .filter(ext => ext.beforeAttributeChange)
        .reduce((val, ext) => ext.beforeAttributeChange(target, this, attr, oldVal, val), newVal);

      if (orig !== newVal)
        this.setAttribute(attr, newVal);

      this.onAttributeChanged(attr, newVal, oldVal);

      extensions.filter(ext => ext.afterAttributeChange)
        .forEach(ext => ext.afterAttributeChange(target, this, attr, oldVal, newVal));

      unlock(this, attr);
    }
  });
}


/**
 * Create the 'connectedCallback' method as defined in the webcomponent specification.
 * It notifies any interested extensions, forwards to the Terracotta specific onConnected method if it exists and requests a render.
 * @param target the class to define the method on
 * @param extensions a list of extensions
 */
export function createConnectedCallback(target: any, extensions: ComponentExtension<Webcomponent>[] = getExtensions(target)) {
  const interested = extensions.filter(ext => ext.connect);
  if (!interested.length) return;
  Object.defineProperty(target.prototype, 'connectedCallback', {
    value: function (this: Webcomponent) {
      interested.forEach(ext => ext.connect(target, this));
      if (this.onConnected)
        this.onConnected();
      this._requestRerender();
    }
  });
}

/**
 * Create the 'disconnectedCallback' method as defined in the webcomponent specification.
 * It notifies any interested extensions and forwards to the Terracotta specific onDisconnected method if it exists.
 * @param target the class to define the method on
 * @param extensions a list of extensions
 */
export function createDisconnectedCallback(target: any, extensions: ComponentExtension<Webcomponent>[] = getExtensions(target)) {
  const interested = extensions.filter(ext => ext.disconnect);
  if (!interested.length) return;
  Object.defineProperty(target.prototype, 'disconnectedCallback', {
    value: function (this: Webcomponent) {
      interested.forEach(ext => ext.disconnect(target, this));
      if (this.onDisconnected)
        this.onDisconnected();
    }
  });
}

/**
 * Create the 'adoptedCallback' method as defined in the webcomponent specification.
 * It notifies any interested extensions, forwards to the Terracotta specific onAdopted method if it exists and requests a render.
 * @param target the class to define the method on
 * @param extensions a list of extensions
 */
export function createAdoptedCallback(target: any, extensions: ComponentExtension<Webcomponent>[] = getExtensions(target)) {
  const interested = extensions.filter(ext => ext.adopt);
  Object.defineProperty(target.prototype, 'adoptedCallback', {
    value: function (this: Webcomponent) {
      interested.forEach(ext => ext.adopt(target, this));
      this._requestRerender();
    }
  });
}
