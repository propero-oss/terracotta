import "jasmine";
import {Component, Watch} from "@/decorators";

describe("decorators > method decorators > watch > Watch", () => {
  it("should call watch methods on value change", () => {
    const spy = jasmine.createSpy();

    @Component()
    class HTMLWatchTest1Element extends HTMLElement {
      prop: string = "";

      @Watch("prop")
      validateProp(val?: string) {
        spy(val);
      }
    }

    expect(spy).toHaveBeenCalledTimes(0);
    const el = new HTMLWatchTest1Element();
    expect(spy).toHaveBeenCalledWith("");
    expect(el.prop).toEqual("");
    el.prop = "something";
    expect(spy).toHaveBeenCalledWith("something");
    expect(el.prop).toEqual("something");
  });
});
