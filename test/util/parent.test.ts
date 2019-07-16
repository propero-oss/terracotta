import "jasmine";
import {getParentOf} from "@/util";


describe("util > parent > getParentOf", () => {
  it("can find the direct parent of an element", () => {
    document.body.innerHTML = `<div id="parent" class="parent">
      <div id="child"></div>
    </div>`;

    const parent = document.querySelector('#parent') as HTMLElement;
    const child = document.querySelector('#child') as HTMLElement;

    expect(getParentOf(child)).toEqual(parent);
  });

  it("can find a parent by selector", () => {
    document.body.innerHTML = `<div id="parent" class="parent">
      <div id="child"></div>
    </div>`;

    const parent = document.querySelector('#parent') as HTMLElement;
    const child = document.querySelector('#child') as HTMLElement;

    expect(getParentOf(child, { selector: '.parent' })).toEqual(parent);
  });

  it("can find a parent by selector multiple levels up", () => {
    document.body.innerHTML = `<div id="parent" class="parent"><div><div>
      <div id="child"></div>
    </div></div></div>`;

    const parent = document.querySelector('#parent') as HTMLElement;
    const child = document.querySelector('#child') as HTMLElement;

    expect(getParentOf(child, { selector: '.parent' })).toEqual(parent);
  });

  it("can find a parent by selector walking the dom", () => {
    document.body.innerHTML = `<div id="parent" class="parent"><div><div>
      <div id="child"></div>
    </div></div></div>`;

    const parent = document.querySelector('#parent') as HTMLElement;
    const child = document.querySelector('#child') as HTMLElement;

    expect(getParentOf(child, { selector: '.parent', walkDom: true })).toEqual(parent);
  });

  it("can find a parent by selector respecting level restriction", () => {
    document.body.innerHTML = `<div id="parent" class="parent"><div><div>
      <div id="child"></div>
    </div></div></div>`;

    const child = document.querySelector('#child') as HTMLElement;

    expect(getParentOf(child, {
      selector: '.parent',
      levels: 2,
      walkDom: true
    })).toBeFalsy();
  });

  it("can traverse shadow dom nodes", () => {
    document.body.innerHTML = `<div id="parent" class="parent"><div></div></div>`;

    const parent = document.querySelector('#parent') as HTMLElement;
    const firstChild = parent.firstChild as HTMLElement;
    const shadow = firstChild.attachShadow({mode: 'open'});
    shadow.innerHTML = `<div><div id="child"></div></div>`;
    const child = shadow.querySelector('#child') as HTMLElement;

    expect(getParentOf(child, { selector: '.parent', walkDom: true })).toEqual(parent);
  });

});
