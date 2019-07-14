import "jasmine";
import {Component, Inject, Injectable} from "@/decorators";

describe("decorators > property decorators > inherit > Inherit", () => {

  it("should inject injectables into decorated properties", () => {
    @Injectable()
    class InjectTest1 {}

    @Component()
    class HTMLInjectTest1Element extends HTMLElement {
      @Inject(InjectTest1)
      foobar: InjectTest1;
    }

    const instance = new HTMLInjectTest1Element();

    expect(instance.foobar instanceof InjectTest1).toBeTruthy();

  });

});
