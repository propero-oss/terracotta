import "jasmine";
import {Component, Validate} from "@/decorators";

describe("decorators > method decorators > validate > Validate", () => {
  it("should call validator methods on value change", () => {
    const spy = jasmine.createSpy();

    @Component()
    class HTMLValidateTest1Element extends HTMLElement {
      prop: string = "";

      @Validate("prop")
      validateProp(val?: string) {
        spy(val);
        return val;
      }
    }

    expect(spy).toHaveBeenCalledTimes(0);
    const el = new HTMLValidateTest1Element();
    expect(spy).toHaveBeenCalledWith("");
    expect(el.prop).toEqual("");
    el.prop = "something";
    expect(spy).toHaveBeenCalledWith("something");
    expect(el.prop).toEqual("something");
  });

  it("should be able to prevent value change", () => {
    const spy = jasmine.createSpy();

    @Component()
    class HTMLValidateTest2Element extends HTMLElement {
      prop: string = "";

      @Validate("prop")
      validateProp(val?: string) {
        spy(val);
        if (val)
          throw new Error("error.");
        return val;
      }
    }

    expect(spy).toHaveBeenCalledTimes(0);
    const el = new HTMLValidateTest2Element();
    expect(spy).toHaveBeenCalledWith("");
    expect(el.prop).toEqual("");
    el.prop = "something";
    expect(spy).toHaveBeenCalledWith("something");
    expect(el.prop).toEqual("");

  })



});
