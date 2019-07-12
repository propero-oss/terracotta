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


});
