/* @jsx element */
import "jasmine";
import {element, createElement, replaceAttributes, isSameElement, keyOf, createTemplate} from "@/render";

describe("render > element > element", () => {
  it("should create a render template for a jsx expression", () => {
    const template = <div class="test">
      <h1>HELLO WORLD</h1>
    </div>;

    expect(template.tag).toEqual("div");
  });
  it("should create dom elements if render is called without arguments", () => {
    const template = <div class="test">
      <h1>HELLO WORLD</h1>
    </div>;

    const el = template.render();

    expect(el.tagName).toEqual("DIV");
    expect(el.innerText.trim()).toEqual("HELLO WORLD");
    expect(el.getAttribute('class')).toEqual("test");
  });
  it("should replace dom elements if render is called without arguments", () => {
    const template = <div id="test">
      <h1>HELLO WORLD</h1>
    </div>;

    document.body.innerHTML = `<div id="test"></div>`;

    const el = document.querySelector('#test') as HTMLDivElement;
    expect(template.render(el)).toEqual(el);

    expect(el.tagName).toEqual("DIV");
    expect(el.innerText.trim()).toEqual("HELLO WORLD");
    expect(el.getAttribute('id')).toEqual("test");
  });
  it("should update dom elements, if matching elements exist", () => {
    document.body.innerHTML = `<div id="test"></div>`;
    const root = document.querySelector('#test') as HTMLDivElement;
    (<div id="test">
      <h1 key="h1">HELLO WORLD</h1>
    </div>).render(root);
    const h1 = document.querySelector('h1');
    const text = h1.firstChild as any;

    (<div id="test">
      <h1 key="h1" class="test">HELLO WORLD</h1>
    </div>).render(root);

    expect(h1.getAttribute('class')).toEqual('test');

    (<div id="test">
      <h1 key="h1" class="test">FOO BAR</h1>
    </div>).render(root);

    expect(text.data).toEqual('FOO BAR');

    (<div id="test">
      <h1 key="h1" class="test" />
    </div>).render(root);

    expect(h1.childNodes.length).toEqual(0);
  });
  it("should update dom element lists adding and removing as necessary", () => {
    document.body.innerHTML = `<ul id="test"></ul>`;
    const root = document.querySelector('#test') as HTMLUListElement;
    (<ul id="test">
      <li key="1">Item 1</li>
      <li key="2">Item 2</li>
      <li key="3">Item 3</li>
      <li key="7">Item 7</li>
    </ul>).render(root);
    const [li1, li2, li3, li7] = root.children as any as HTMLDataListElement[];
    (<ul id="test">
      <li key="1">Item 1 - Updated</li>
      <li key="2">Item 2 - Updated</li>
      <li key="3">Item 3</li>
      <li key="4">Item 4 - Added</li>
      <li key="5">Item 5 - Added</li>
      <li key="6">Item 6 - Added</li>
      <li key="7">Item 7</li>
    </ul>).render(root);
    const li4 = root.children[3] as HTMLDataListElement;
    const li5 = root.children[4] as HTMLDataListElement;
    const li6 = root.children[5] as HTMLDataListElement;
    expect(li1.innerText).toEqual("Item 1 - Updated");
    expect(li2.innerText).toEqual("Item 2 - Updated");
    expect(li3.innerText).toEqual("Item 3");
    expect(li4.innerText).toEqual("Item 4 - Added");
    expect(li5.innerText).toEqual("Item 5 - Added");
    expect(li6.innerText).toEqual("Item 6 - Added");
    expect(li7.innerText).toEqual("Item 7");
    (<ul id="test">
      <li key="3">Item 3 - Updated</li>
      <li key="4">Item 4 - Updated</li>
      <li key="5">Item 5 - Added</li>
      <li key="6">Item 6 - Added</li>
      <li key="7">Item 7</li>
    </ul>).render(root);
    expect(li3.innerText).toEqual("Item 3 - Updated");
    expect(li4.innerText).toEqual("Item 4 - Updated");
  });
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

describe("render > element > createTemplate", () => {
  it("should return a rendered template, if one is passed", () => {
    expect(createTemplate({render(){return "test"}})).toEqual("test");
  });
  it("should create a text node if a string is passed", () => {
    expect(createTemplate("test").data).toEqual("test");
  });
});
