import "jasmine";
import {element, createElement, replaceSame, replaceChildren, replaceAttributes, isSameElement, keyOf} from "@/render";

describe("render > element > element", () => {

});

describe("render > element > createElement", () => {
  it("should create a new dom element for a passed string", () => {
    expect(createElement("div").tagName).toEqual("DIV");
  });
  it("should construct an instance if a function is passed", () => {
    class MyElement extends HTMLElement {}
    customElements.define("my-element", MyElement);
    expect(createElement(MyElement).tagName).toEqual("MY-ELEMENT");
  })
});

describe("render > element > replaceSame", () => {

});

describe("render > element > replaceChildren", () => {

});

describe("render > element > replaceAttributes", () => {
  it("should add new attributes", () => {
    const el = document.createElement("div") as HTMLElement;
    replaceAttributes(el, {class: "some-class"});
    expect(el.getAttribute("class")).toEqual("some-class");
  });
  it("should remove old attributes", () => {
    const el = document.createElement("div") as HTMLElement;
    el.setAttribute("data-test", "test");
    replaceAttributes(el, {});
    expect(el.getAttribute("data-text")).toBeFalsy();
  });
  it("should update changed attributes", () => {
    const el = document.createElement("div") as HTMLElement;
    el.setAttribute("data-test", "test");
    replaceAttributes(el, {"data-test": "test2"});
    expect(el.getAttribute("data-test")).toEqual("test2");
  });
  it("should ignore unchanged attributes", () => {
    const el = document.createElement("div") as HTMLElement;
    el.setAttribute("data-test", "test");
    spyOn(el, "setAttribute");
    replaceAttributes(el, {"data-test": "test"});
    expect(el.setAttribute).toHaveBeenCalledTimes(0);
    expect(el.getAttribute("data-test")).toEqual("test");
  })
});

describe("render > element > isSameElement", () => {
  it("should return true for the same element", () => {
    const el: any = document.createElement("div") as HTMLElement;
    expect(isSameElement(el, el)).toBeTruthy();
  });
  it("should compare object key attributes", () => {
    const el: any = document.createElement("div") as HTMLElement;
    const el2: any = {};
    el.key = el2.key = "some-key";
    expect(isSameElement(el, el2)).toBeTruthy();
  });
  it("should not match independent elements", () => {
    const el: any = document.createElement("div") as HTMLElement;
    const el2: any = document.createElement("p") as HTMLElement;
    expect(isSameElement(el, el2)).toBeFalsy();
  })
});

describe("render > element > keyOf", () => {
  it("should return the key attribute if it is defined", () => {
    const el: any = document.createElement("div") as HTMLElement;
    el.key = "some-key";
    el.id = "some-id";
    expect(keyOf(el)).toEqual("some-key");
  });
  it("should return the tag name and id attribute as a fallback", () => {
    const el: any = document.createElement("div") as HTMLElement;
    el.id = "some-id";
    expect(keyOf(el)).toEqual("DIV#some-id");
  })
});
