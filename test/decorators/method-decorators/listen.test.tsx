import "jasmine";
import {Component, Listen} from "@/decorators";
import {Webcomponent} from "@/types";

describe("decorators > method decorators > listen > Listen", () => {

  it("should bind a method to an instance on component construction", () => {
    @Component()
    class HTMLListenTest1Element extends HTMLElement {
      @Listen("click")
      foobar() {
        return this;
      }
    }

    const proto = HTMLListenTest1Element.prototype;
    const instance = new HTMLListenTest1Element();

    expect(proto.foobar.call(null)).toBe(null);
    expect(instance.foobar.call(null)).toBe(instance);
  });

  it("should bind event listeners to the host element for given events", () => {

    const spy = jasmine.createSpy();

    @Component()
    class HTMLListenTest2Element extends HTMLElement {
      @Listen("click")
      foobar() { spy(); }
    }

    document.body.innerHTML=`<div id="test"></div>`;
    const root: HTMLDivElement = document.querySelector("#test") as HTMLDivElement;

    (<div id="container">
      <listen-test2/>
    </div>).render(root);

    const el: HTMLListenTest2Element = document.querySelector("listen-test2");

    el.click();
    el.dispatchEvent(new MouseEvent("click",{}));

    expect(spy).toHaveBeenCalledTimes(2);

  });

  it("should allow for binding handlers to the parent element", () => {
    const spy = jasmine.createSpy();

    @Component()
    class HTMLListenTest3Element extends HTMLElement {
      @Listen("parent@click")
      foobar() { spy(); }

      @Listen({ target: "parent", event: "click" })
      baz() { spy(); }
    }

    document.body.innerHTML=`<div id="test"></div>`;
    const root: HTMLDivElement = document.querySelector("#test") as HTMLDivElement;

    (<div id="container">
      <listen-test3/>
    </div>).render(root);

    const el: HTMLDivElement = document.querySelector("#container");

    el.click();
    el.dispatchEvent(new MouseEvent("click",{}));

    expect(spy).toHaveBeenCalledTimes(4);

  });

  it("should allow for binding handlers to the document element", () => {
    const spy = jasmine.createSpy();

    @Component()
    class HTMLListenTest4Element extends HTMLElement {
      @Listen("document@click")
      foobar() { spy(); }

      @Listen({ target: "document", event: "click" })
      baz() { spy(); }
    }

    document.body.innerHTML=`<div id="test"></div>`;
    const root: HTMLDivElement = document.querySelector("#test") as HTMLDivElement;

    (<div id="container">
      <listen-test4/>
    </div>).render(root);

    const el = document;

    el.dispatchEvent(new MouseEvent("click",{}));

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should allow for binding handlers to the window element", () => {
    const spy = jasmine.createSpy();

    @Component()
    class HTMLListenTest5Element extends HTMLElement {
      @Listen("window@click")
      foobar() { spy(); }

      @Listen({ target: "window", event: "click" })
      baz() { spy(); }
    }

    document.body.innerHTML=`<div id="test"></div>`;
    const root: HTMLDivElement = document.querySelector("#test") as HTMLDivElement;

    (<div id="container">
      <listen-test5/>
    </div>).render(root);

    const el = window;

    el.dispatchEvent(new MouseEvent("click",{}));

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should allow for binding handlers to a given css selector inside the element", () => {
    const spy = jasmine.createSpy();

    @Component()
    class HTMLListenTest6Element extends HTMLElement {
      @Listen("#el@click")
      foobar() { spy(); }

      @Listen({ target: "#el", event: "click" })
      baz() { spy(); }

      render() {
        return <div id="el" />
      }
    }

    document.body.innerHTML=`<div id="test"></div>`;
    const root: HTMLDivElement = document.querySelector("#test") as HTMLDivElement;

    (<div id="container">
      <listen-test6/>
    </div>).render(root);

    const test: Webcomponent = document.querySelector('listen-test6');
    const el = test.hostElementRoot.querySelector('#el');

    el.dispatchEvent(new MouseEvent("click",{}));

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should allow for binding handlers to a given element", () => {
    const spy = jasmine.createSpy();
    const el = document.createElement("div") as HTMLDivElement;

    @Component()
    class HTMLListenTest7Element extends HTMLElement {
      @Listen({ target: el, event: "click" })
      baz() { spy(); }
    }

    document.body.innerHTML=`<div id="test"></div>`;
    const root: HTMLDivElement = document.querySelector("#test") as HTMLDivElement;

    (<div id="container">
      <listen-test7/>
    </div>).render(root);

    el.dispatchEvent(new MouseEvent("click",{}));

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should attach and detach handlers after and before each render or once only", () => {
    const el1 = document.createElement("div");
    const el2 = document.createElement("div");

    @Component()
    class HTMLListenTest8Element extends HTMLElement {
      @Listen({ once: true,  event: "click", target: el1 })
      foobar() {}
      @Listen({ once: false, event: "click", target: el2 })
      baz() {}
    }

    spyOn(el1, "addEventListener").and.callThrough();
    spyOn(el1, "removeEventListener").and.callThrough();
    spyOn(el2, "addEventListener").and.callThrough();
    spyOn(el2, "removeEventListener").and.callThrough();

    document.body.innerHTML=`<div id="test"></div>`;
    const root: HTMLDivElement = document.querySelector("#test") as HTMLDivElement;

    (<div id="container">
      <listen-test8/>
    </div>).render(root);

    expect(el1.addEventListener).toHaveBeenCalledTimes(1);
    expect(el1.removeEventListener).toHaveBeenCalledTimes(0);
    expect(el2.addEventListener).toHaveBeenCalledTimes(2); // connected + afterRender
    expect(el2.removeEventListener).toHaveBeenCalledTimes(1); // beforeRender

    // @ts-ignore
    document.querySelector('listen-test8')._requestRerender();

    expect(el1.addEventListener).toHaveBeenCalledTimes(1);
    expect(el1.removeEventListener).toHaveBeenCalledTimes(0);
    expect(el2.addEventListener).toHaveBeenCalledTimes(3); // + afterRender
    expect(el2.removeEventListener).toHaveBeenCalledTimes(2); // + beforeRender

    (<div id="container" />).render(root);

    expect(el1.addEventListener).toHaveBeenCalledTimes(1);
    expect(el1.removeEventListener).toHaveBeenCalledTimes(1); // disconnected
    expect(el2.addEventListener).toHaveBeenCalledTimes(3); // connected + afterRender
    expect(el2.removeEventListener).toHaveBeenCalledTimes(3); // + disconnected

  });


});
