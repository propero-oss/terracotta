import "jasmine";
import {Component, Parent} from "@/decorators";

describe("decorators > property decorators > parent > Parent", () => {
  it("should create a getter to the parent element", () => {

    @Component()
    class HTMLParentTest1Element extends HTMLElement {
      @Parent()
      foobar: HTMLElement;
    }

    document.body.innerHTML=`<div></div>`;
    const instance = new HTMLParentTest1Element();
    const parent = document.body.firstElementChild as HTMLDivElement;

    expect(instance.foobar).toBeNull();
    parent.appendChild(instance);
    expect(instance.foobar).toBe(parent);
    parent.removeChild(instance);
    expect(instance.foobar).toBeNull();

  });

  it("should fetch the parent only once if once is set to true", () => {

    @Component()
    class HTMLParentTest2Element extends HTMLElement {
      @Parent({ once: true, selector: ".parent" })
      foobar: HTMLElement;
    }

    document.body.innerHTML=`<div class="parent"></div>`;
    const instance = new HTMLParentTest2Element();
    const parent = document.body.firstElementChild as HTMLDivElement;

    expect(instance.foobar).toBeNull();

    parent.appendChild(instance);
    expect(instance.foobar).toBe(parent);

    parent.classList.remove("parent");
    expect(instance.foobar).toBe(parent);

    parent.removeChild(instance);
    expect(instance.foobar).toBeNull();

  });
});
