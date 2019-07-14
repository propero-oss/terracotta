import "jasmine";
import {Component, Inherit} from "@/decorators";

describe("decorators > property decorators > inherit > Inherit", () => {
  it("should sync properties on connect and unset on disconnect", () => {

    @Component()
    class HTMLInheritTest1Element extends HTMLElement {
      @Inherit()
      foobar: string;
    }

    document.body.innerHTML = `<div></div>`;
    const parent = document.body.firstElementChild as HTMLDivElement;
    const instance = new HTMLInheritTest1Element();

    (parent as any).foobar = "test";
    expect(instance.foobar).toBeUndefined();

    parent.appendChild(instance);
    expect(instance.foobar).toEqual("test");

    parent.removeChild(instance);
    expect(instance.foobar).toBeUndefined();

  });

  it("should sync properties on specified events", () => {

    @Component()
    class HTMLInheritTest2Element extends HTMLElement {
      @Inherit({ syncOn: ["click"] })
      foobar: string;
    }

    document.body.innerHTML = `<div></div>`;
    const parent = document.body.firstElementChild as HTMLDivElement;
    const instance = new HTMLInheritTest2Element();


    parent.appendChild(instance);
    (parent as any).foobar = "test";
    expect(instance.foobar).toBeUndefined();
    parent.click();
    expect(instance.foobar).toEqual("test");

  });

  it("should trigger rerender on sync change events", () => {

    @Component()
    class HTMLInheritTest3Element extends HTMLElement {
      @Inherit({ syncOn: ["click"], rerender: true })
      foobar: string;

      render() {
        return <div>{this.foobar || ""}</div>;
      }
    }

    document.body.innerHTML = `<div></div>`;
    const parent = document.body.firstElementChild as HTMLDivElement;
    const instance = new HTMLInheritTest3Element();

    parent.appendChild(instance);
    (parent as any).foobar = "test";
    expect(instance.foobar).toBeUndefined();
    parent.click();
    expect(instance.foobar).toEqual("test");
    expect(instance.textContent).toEqual("test");
    parent.removeChild(instance);
    expect(instance.foobar).toBeUndefined();
    // No rerender, since disconnected
    expect(instance.textContent).toEqual("test");

  });
});
