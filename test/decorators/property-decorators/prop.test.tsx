import "jasmine";
import {Component, Prop} from "@/decorators";
import {Stages} from "../../../src/constants";

describe("decorators > property decorators > prop > Prop", () => {
  it("supports inferring properties on connect", () => {
    @Component()
    class HTMLPropTest1Element extends HTMLElement {
      @Prop()
      foobar: string;
    }

    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;

    (<div id="container">
      <prop-test1 foobar="baz" />
    </div>).render(root);

    const el = document.querySelector("#container>*") as HTMLPropTest1Element;
    expect(el.foobar).toEqual("baz");
  });

  it("syncs attributes to properties", () => {
    @Component()
    class HTMLPropTest2Element extends HTMLElement {
      @Prop({ sync: "attr" })
      foobar: string;
    }

    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;

    (<div id="container">
      <prop-test2 foobar="baz" />
    </div>).render(root);

    const el = document.querySelector("#container>*") as HTMLPropTest2Element;
    expect(el.foobar).toEqual("baz");

    el.setAttribute("foobar", "bar");
    expect(el.foobar).toEqual("bar");
  });

  it("syncs properties to attributes", () => {
    @Component()
    class HTMLPropTest3Element extends HTMLElement {
      @Prop({ sync: "prop" })
      foobar: string;
    }

    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;

    (<div id="container">
      <prop-test3 foobar="baz" />
    </div>).render(root);

    const el = document.querySelector("#container>*") as HTMLPropTest3Element;
    expect(el.foobar).toEqual(undefined);
    expect(el.getAttribute("foobar")).toEqual("baz");

    el.foobar = "bar";
    expect(el.foobar).toEqual("bar");
    expect(el.getAttribute("foobar")).toEqual("bar");

    el.foobar = undefined;
    expect(el.foobar).toBeUndefined();
    expect(el.hasAttribute("foobar")).toBeFalsy();

  });

  it("syncs properties to attributes and vice versa", () => {
    @Component()
    class HTMLPropTest4Element extends HTMLElement {
      @Prop({ sync: "both" })
      foobar: string;
    }

    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;

    (<div id="container">
      <prop-test4 foobar="baz" />
    </div>).render(root);

    const el = document.querySelector("#container>*") as HTMLPropTest4Element;
    expect(el.foobar).toEqual("baz");
    expect(el.getAttribute("foobar")).toEqual("baz");

    el.foobar = "bar";
    expect(el.foobar).toEqual("bar");
    expect(el.getAttribute("foobar")).toEqual("bar");

    el.setAttribute("foobar", "qux");
    expect(el.foobar).toEqual("qux");
    expect(el.getAttribute("foobar")).toEqual("qux");

    el.foobar = undefined;
    expect(el.foobar).toBeUndefined();
    expect(el.hasAttribute("foobar")).toBeFalsy();

  });

  it("notifies interested parties", () => {
    @Component()
    class HTMLPropTest5Element extends HTMLElement {
      @Prop({ sync: "both", notify: true })
      foobar: string;
    }

    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;
    const spy = jasmine.createSpy();
    const handler = (ev) => {
      spy(ev.detail);
    };
    root.addEventListener('property-change', handler);

    root.innerHTML = `<prop-test5 foobar="qux" />`;
    expect(spy).toHaveBeenCalledWith({
      property: "foobar",
      stage: Stages.ATTRIBUTE,
      oldVal: undefined,
      newVal: "qux"
    });

    const el = root.firstElementChild as HTMLPropTest5Element;

    el.foobar = "test";
    expect(spy).toHaveBeenCalledWith({
      property: "foobar",
      stage: Stages.PROPERTY,
      oldVal: "qux",
      newVal: "test"
    });
    el.setAttribute("foobar", "baz");
    expect(spy).toHaveBeenCalledWith({
      property: "foobar",
      stage: Stages.ATTRIBUTE,
      oldVal: "test",
      newVal: "baz"
    });

  });
});
