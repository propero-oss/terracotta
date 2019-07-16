import "jasmine";
import {Terra} from "@/mixins";
import {ComponentMixin, Prop} from "@/decorators";
import {getExtensions} from "@/component";

describe("mixins > terra > Terra", () => {

  it("can be called without arguments", () => {
    const cls = Terra();
    expect(Object.getPrototypeOf(cls)).toEqual(HTMLElement);
  });

  it("can be called with a different main class", () => {
    const cls = Terra(HTMLDivElement);
    expect(Object.getPrototypeOf(cls)).toEqual(HTMLDivElement);
  });

  it("should add all mixin extensions to the returned class", () => {
    @ComponentMixin()
    class Mixin {
      @Prop() public foo: string;
    }
    const cls = Terra(HTMLElement, Mixin);
    expect(getExtensions(Mixin)).toEqual(getExtensions(cls));
  });

  it("extends the returned class with instance members from mixins", () => {
    class Mixin {
      public foo() {}
      public get bar() { return "baz" };
    }
    const cls = Terra(HTMLElement, Mixin);
    expect(Object.getPrototypeOf(cls)).toEqual(HTMLElement);
    expect(cls.prototype.foo).toEqual(Mixin.prototype.foo);
    expect(cls.prototype.bar).toEqual(Mixin.prototype.bar);
    expect(Object.getOwnPropertyDescriptor(cls.prototype, "bar"))
      .toEqual(Object.getOwnPropertyDescriptor(Mixin.prototype, "bar"));
  });

  it("extends the returned class with static members", () => {
    class Mixin {
      public static foo() {}
      public static get bar() { return "baz" };
    }
    const cls = Terra(HTMLElement, Mixin);
    expect(Object.getPrototypeOf(cls)).toEqual(HTMLElement);
    expect(cls.foo).toEqual(Mixin.foo);
    expect(cls.bar).toEqual(Mixin.bar);
    expect(Object.getOwnPropertyDescriptor(cls, "bar"))
      .toEqual(Object.getOwnPropertyDescriptor(Mixin, "bar"));
  });

  it("extends the returned class with inherited instance members from mixins", () => {
    class Super {
      public foo() {}
      public get bar() { return "baz" };
    }
    class Mixin extends Super {
      public foo() {}
      public baz() {}
    }
    const cls = Terra(HTMLElement, Mixin);
    expect(Object.getPrototypeOf(cls)).toEqual(HTMLElement);
    expect(cls.prototype.foo).toEqual(Mixin.prototype.foo);
    expect(cls.prototype.bar).toEqual(Mixin.prototype.bar);
    expect(cls.prototype.baz).toEqual(Mixin.prototype.baz);
    expect(Object.getOwnPropertyDescriptor(cls.prototype, "bar"))
      .toEqual(Object.getOwnPropertyDescriptor(Super.prototype, "bar"));
  });

  it("extends the returned class with inherited static members from mixins", () => {
    class Super {
      public static foo() {}
      public static get bar() { return "baz" };
    }
    class Mixin extends Super {
      public static foo() {}
      public static baz() {}
    }
    const cls = Terra(HTMLElement, Mixin);
    expect(Object.getPrototypeOf(cls)).toEqual(HTMLElement);
    expect(cls.foo).toEqual(Mixin.foo);
    expect(cls.bar).toEqual(Mixin.bar);
    expect(cls.baz).toEqual(Mixin.baz);
    expect(Object.getOwnPropertyDescriptor(cls, "bar"))
      .toEqual(Object.getOwnPropertyDescriptor(Super, "bar"));
  });

  it("respects the order of mixins, prioritizing the last passed mixin", () => {
    class Mixin1 {
      public foo() {}
      public bar() {}
    }
    class Mixin2 {
      public foo() {}
      public baz() {}
    }
    // @ts-ignore
    const cls = Terra(HTMLElement, Mixin1, Mixin2);
    expect(Object.getPrototypeOf(cls)).toEqual(HTMLElement);
    expect(cls.prototype.foo).toEqual(Mixin2.prototype.foo);
    expect(cls.prototype.bar).toEqual(Mixin1.prototype.bar);
    expect(cls.prototype.baz).toEqual(Mixin2.prototype.baz);
  });

});
