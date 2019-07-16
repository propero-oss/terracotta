import "jasmine";
import {Component, Query} from "@/decorators";

describe("decorators > property decorators > query > Query", () => {

  it("should find a member by css selector", () => {
    @Component()
    class HTMLQueryTest1Element extends HTMLElement {
      @Query("#test")
      public test: HTMLDivElement;
      render() {
        return <div>
          <p>
            <div id="test" data-foo="bar">
              Hello World!
            </div>
          </p>
        </div>
      }
    }

    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;
    (<div id="container">
      <query-test1 />
    </div>).render(root);
    const el = root.firstElementChild as HTMLQueryTest1Element;
    expect(el.test).toBeDefined();
    expect(el.test.dataset.foo).toEqual("bar");

  });

  it("should find a parent css selector", () => {
    @Component()
    class HTMLQueryTest2Element extends HTMLElement {
      @Query("parent@#test")
      public test: HTMLDivElement;

      render() {
        return <div></div>
      }
    }
    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;
    (<div id="container">
      <query-test2 />
      <div id="test" data-foo="bar" />
    </div>).render(root);
    const el = root.firstElementChild as HTMLQueryTest2Element;
    expect(el.test).toBeDefined();
    expect(el.test.dataset.foo).toEqual("bar");
  });

  it("should find a document css selector", () => {
    @Component()
    class HTMLQueryTest3Element extends HTMLElement {
      @Query("document@#test")
      public test: HTMLDivElement;

      render() {
        return <div></div>
      }
    }
    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;
    (<div id="container">
      <div>
        <p><query-test3 /></p>
      </div>
      <p><div id="test" data-foo="bar" /></p>
    </div>).render(root);
    const el = root.querySelector("query-test3") as HTMLQueryTest3Element;
    expect(el.test).toBeDefined();
    expect(el.test.dataset.foo).toEqual("bar");
  });

  it("should find a css selector of a parent css selector (selectorception)", () => {
    @Component()
    class HTMLQueryTest4Element extends HTMLElement {
      @Query("#container@#test")
      public test: HTMLDivElement;

      render() {
        return <div></div>
      }
    }
    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;
    (<div id="container">
      <p><div id="test" data-foo="bar" /></p>
      <div>
        <p><query-test4 /></p>
        <div id="test" />
      </div>
    </div>).render(root);
    const el = root.querySelector("query-test4") as HTMLQueryTest4Element;
    expect(el.test).toBeDefined();
    expect(el.test.dataset.foo).toEqual("bar");
  });

  it("should find a css selector of a specific provided parent", () => {
    const target = (<p><div id="test" data-foo="bar" /></p>).render();

    @Component()
    class HTMLQueryTest5Element extends HTMLElement {
      @Query({ target: target, selector: '#test' })
      public test: HTMLDivElement;

      render() {
        return <div>
          <div id="test" data-foo="baz" />
        </div>
      }
    }
    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;
    (<div id="container">
      <div id="test" data-foo="baz" />
      <div>
        <p><query-test5 /></p>
        <div id="test" />
      </div>
    </div>).render(root);
    const el = root.querySelector("query-test5") as HTMLQueryTest5Element;
    expect(el.test).toBeDefined();
    expect(el.test.dataset.foo).toEqual("bar");
  });

  it("should cache elements if once is set", () => {
    @Component()
    class HTMLQueryTest6Element extends HTMLElement {
      @Query({ target: '#container', selector: '#test', once: true })
      public test: HTMLDivElement;

      render() {
        return <div>
          <div id="test" data-foo="baz" />
        </div>
      }
    }
    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;
    (<div id="container">
      <div id="test" data-foo="bar"  />
      <div>
        <p><query-test6 /></p>
      </div>
    </div>).render(root);
    const el = root.querySelector("query-test6") as HTMLQueryTest6Element;
    expect(el.test).toBeDefined();
    expect(el.test.dataset.foo).toEqual("bar");
    root.removeChild(el.test);
    expect(el.test).toBeDefined();
    expect(el.test.dataset.foo).toEqual("bar");
    // @ts-ignore
    el._requestRerender();
    expect(el.test).toBeDefined();
    expect(el.test.dataset.foo).toEqual("bar");
  });

  it("should cache elements until render if onRender is set", () => {
    @Component()
    class HTMLQueryTest7Element extends HTMLElement {
      @Query({ target: '#container', selector: '#test', onRender: true })
      public test: HTMLDivElement;

      render() {
        return <div>
          <div id="test" data-foo="baz" />
        </div>
      }
    }
    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;
    (<div id="container">
      <div id="test" data-foo="bar"  />
      <div>
        <p><query-test7 /></p>
      </div>
    </div>).render(root);
    const el = root.querySelector("query-test7") as HTMLQueryTest7Element;
    expect(el.test).toBeDefined();
    expect(el.test.dataset.foo).toEqual("bar");
    root.removeChild(el.test);
    expect(el.test).toBeDefined();
    expect(el.test.dataset.foo).toEqual("bar");
    // @ts-ignore
    el._requestRerender();
    expect(el.test).toBeNull();
  });

  it("should be able to fetch multiple elements", () => {
    @Component()
    class HTMLQueryTest8Element extends HTMLElement {
      @Query({ target: '#container', selector: '.test', multiple: true })
      public test: HTMLDivElement[];

      render() {
        return <div>
          <div id="test" data-foo="baz" />
        </div>
      }
    }
    document.body.innerHTML = `<div></div>`;
    const root = document.body.firstElementChild;
    (<div id="container">
      <div class="test" data-foo="bar"  />
      <div class="test" data-foo="bar"  />
      <div>
        <p><query-test8 /></p>
      </div>
    </div>).render(root);
    const el = root.querySelector("query-test8") as HTMLQueryTest8Element;
    expect(el.test).toBeDefined();
    expect(el.test.length).toEqual(2);
    expect(el.test[0].dataset.foo).toEqual("bar");
    expect(el.test[1].dataset.foo).toEqual("bar");
  })

});
