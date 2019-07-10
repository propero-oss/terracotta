import "jasmine"
import {Component} from "@/decorators";
import {addExtension, ComponentExtension} from "../../../src/component";
import {Constructor, Webcomponent} from "../../../src/types";

describe("decorators > class-decorators > Component", () => {

  it("can be applied to any class", () => {
    @Component()
    class HTMLFirstComponentTestElement {}
  });
  it("automatically generates a tag name based on class name", () => {
    @Component()
    class HTMLSecondComponentTestElement {}
    // @ts-ignore
    expect(HTMLSecondComponentTestElement.is).toEqual("second-component-test");
  });
  it("creates terra methods and hooks", () => {
    @Component()
    class HTMLThirdComponentTestElement {}

    const methods = [
      "setModel", "getModel", "_setProperties", "_getProperties",
      "_setAttributes", "_getAttributes", "_requestRerender"
    ];
    const getters = ["hostElementRoot"];

    const proto = HTMLThirdComponentTestElement.prototype as any;
    for (let method of methods)
      expect(proto[method]).toBeTruthy(method);
    for (let getter of getters)
      expect(Object.getOwnPropertyDescriptor(proto, getter)).toBeTruthy(getter);
  });
  it("creates webcomponent methods and hooks", () => {
    @Component()
    class HTMLForthComponentTestElement {}

    const staticGetters = ["is", "observedAttributes"];
    const methods = ["attributeChangedCallback", "connectedCallback", "disconnectedCallback", "adoptedCallback"];
    const getters = ["hostElementRoot"];

    const proto = HTMLForthComponentTestElement.prototype as any;
    const cls = HTMLForthComponentTestElement as any;
    for (let getter of staticGetters)
      expect(Object.getOwnPropertyDescriptor(cls, getter)).toBeTruthy(getter);
    for (let getter of getters)
      expect(Object.getOwnPropertyDescriptor(proto, getter)).toBeTruthy(getter);
    for (let method of methods)
      expect(proto[method]).toBeTruthy(method);
  });
  it("should register extensions and call their 'register' hook", () => {
    let wasCalled = false;
    class HTMLFifthComponentTestElement {}
    class SpecialExtension implements ComponentExtension<Webcomponent> {
      register(cls: Constructor<Webcomponent>) {
        expect(cls).toEqual(HTMLFifthComponentTestElement);
        wasCalled = true;
      }
    }
    addExtension(HTMLFifthComponentTestElement, new SpecialExtension());
    Component()(HTMLFifthComponentTestElement);
    expect(wasCalled).toBeTruthy();
  });
});
