import "jasmine";
import {Injectable, Injectables} from "@/decorators";
import {Inject} from "../../../src/decorators";

describe("decorators > class-decorators > injectable > Injectable", () => {

  it("should register a class to be injectable", () => {
    @Injectable()
    class InjectableTest1 {}

    expect(Injectables.get(InjectableTest1)).toBeTruthy();
    expect(Injectables.get("injectable-test1")).toBeTruthy();
  });

  it("should throw for nonexistent injectables", () => {
    expect(() => Injectables.get("something")).toThrow();
  });

  it("should allow registering under different names", () => {
    @Injectable("foobar")
    class InjectableTest2 {}

    expect(Injectables.get("foobar")).toBeTruthy();
  });

  it("should allow for singletons to be registered", () => {
    @Injectable(null, { singleton: true })
    class InjectableTest3 {}
    expect(Injectables.opts(InjectableTest3).singleton).toBeTruthy();
  });

  it("should allow for factories to be registered", () => {
    @Injectable(null, { factory: "someMethod" })
    class InjectableTest3 {
      someMethod() {}
    }
    expect(Injectables.opts(InjectableTest3).factory).toEqual("someMethod");
  });

  it("should inject property definitions", () => {
    @Injectable()
    class InjectableTest4 {}
    const target = {};
    Injectables.inject(InjectableTest4, target, "foo", null);
    // @ts-ignore
    expect(target.foo instanceof InjectableTest4).toBeTruthy();
  });

  it("should inject a new instance for every target by default", () => {
    @Injectable()
    class InjectableTest5 {}
    const first = {};
    const second = {};
    Injectables.inject(InjectableTest5, first, "foo", null);
    Injectables.inject(InjectableTest5, second, "foo", null);

    // @ts-ignore
    expect(first.foo).not.toBe(second.foo);
    // @ts-ignore
    expect(first.foo).toBe(first.foo);
    // @ts-ignore
    expect(second.foo).toBe(second.foo);
  });

  it("should instantiate a singleton only once on first access", () => {
    @Injectable(null, {singleton: true})
    class InjectableTest6 {}
    const first = {};
    const second = {};
    Injectables.inject(InjectableTest6, first, "foo", null);
    Injectables.inject(InjectableTest6, second, "foo", null);

    // @ts-ignore
    expect(first.foo).toBe(second.foo);
    // @ts-ignore
    expect(first.foo instanceof InjectableTest6).toBeTruthy()
  });

  it("should honor factory function settings for singletons", () => {
    // @ts-ignore
    @Injectable(null, {singleton: true, factory: "create"})
    class InjectableTest7 {
      public static create() {
        return new InjectableTest7();
      }
    }
    spyOn(InjectableTest7, "create").and.callThrough();

    const first = {};
    const second = {};
    Injectables.inject(InjectableTest7, first, "foo", null);
    Injectables.inject(InjectableTest7, second, "foo", null);

    // @ts-ignore
    expect(first.foo).toBe(second.foo);
    // @ts-ignore
    expect(first.foo instanceof InjectableTest7).toBeTruthy();
    expect(InjectableTest7.create).toHaveBeenCalledTimes(1);
  });

  it("should use a factory function if one is given", () => {
    // @ts-ignore
    @Injectable(null, {factory: "create"})
    class InjectableTest8 {
      public static create() {
        return new InjectableTest8();
      }
    }
    spyOn(InjectableTest8, "create").and.callThrough();

    const first = {};
    const second = {};
    Injectables.inject(InjectableTest8, first, "foo", null);
    Injectables.inject(InjectableTest8, second, "foo", null);

    // @ts-ignore
    expect(first.foo).not.toBe(second.foo);
    // @ts-ignore
    expect(first.foo instanceof InjectableTest8).toBeTruthy();
    // @ts-ignore
    expect(second.foo instanceof InjectableTest8).toBeTruthy();
    expect(InjectableTest8.create).toHaveBeenCalledTimes(2);
  });

  it("should inject the class itself, if the static property is set", () => {
    @Injectable(null, {static: true})
    class InjectableTest9 {};

    const first = {};
    const second = {};
    Injectables.inject(InjectableTest9, first, "foo", null);
    Injectables.inject(InjectableTest9, second, "foo", null);


    // @ts-ignore
    expect(first.foo).toBe(second.foo);
    // @ts-ignore
    expect(first.foo).toBe(InjectableTest9);
    // @ts-ignore
    expect(second.foo).toBe(InjectableTest9);

  });


});
