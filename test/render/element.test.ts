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

});

describe("render > element > isSameElement", () => {

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
