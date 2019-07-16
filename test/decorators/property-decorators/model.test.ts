import "jasmine";
import {Component, Model} from "@/decorators";

describe("decorators > property decorators > model > Model", () => {

  it("should create a model getter", () => {
    // TODO test expectations, Models NYI
    @Component()
    class HTMLModelTest1Element extends HTMLElement {
      @Model()
      prop: string;
    }

    expect(true).toBeTruthy();
  });

});
