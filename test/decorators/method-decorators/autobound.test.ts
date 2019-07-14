import "jasmine";
import {Component, Autobound} from "@/decorators";

describe("decorators > method decorators > autobound > Autobound", () => {

  it("should bind a method to an instance on component construction", () => {
    @Component()
    class HTMLAutoboundTest1Element extends HTMLElement {
      @Autobound()
      foobar() {
        return this;
      }
    }

    const proto = HTMLAutoboundTest1Element.prototype;
    const instance = new HTMLAutoboundTest1Element();

    expect(proto.foobar.call(null)).toBe(null);
    expect(instance.foobar.call(null)).toBe(instance);
  });

  it("should work for multiple methods", () => {
    @Component()
    class HTMLAutoboundTest2Element extends HTMLElement {
      @Autobound()
      foobar() {
        return this;
      }

      @Autobound()
      baz() {
        return this;
      }
    }

    const proto = HTMLAutoboundTest2Element.prototype;
    const instance = new HTMLAutoboundTest2Element();

    expect(proto.foobar.call(null)).toBe(null);
    expect(proto.baz.call(null)).toBe(null);
    expect(instance.foobar.call(null)).toBe(instance);
    expect(instance.baz.call(null)).toBe(instance);
  });


});
