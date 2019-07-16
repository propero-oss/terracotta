import "jasmine";
import {Component, Event, EventEmitter} from "@/decorators";

describe("decorators > property decorators > event > Event", () => {
  it("should define an EventEmitter object on the instance", () => {
    @Component()
    class HTMLEventTest1Element extends HTMLElement {
      @Event()
      onFoobar: EventEmitter<any>
    }

    const instance = new HTMLEventTest1Element();

    expect(instance.onFoobar).toBeDefined();
    expect(instance.onFoobar instanceof EventEmitter).toBeTruthy();

  });

  it("should generate an event-name from the decorated property name, stripping 'on' and 'event'", () => {
    @Component()
    class HTMLEventTest2Element extends HTMLElement {
      @Event()
      onFoobarEvent: EventEmitter<any>
    }

    const instance = new HTMLEventTest2Element();

    expect(instance.onFoobarEvent.options.name).toEqual("foobar");
  });

  it("should be able to emit events", () => {
    const spy = jasmine.createSpy();

    @Component()
    class HTMLEventTest3Element extends HTMLElement {
      @Event()
      onFoobar: EventEmitter<any>
    }

    const instance = new HTMLEventTest3Element();
    instance.addEventListener("foobar", spy);
    expect(spy).toHaveBeenCalledTimes(0);
    instance.onFoobar.emit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should pass data to event handlers as 'detail'", () => {
    @Component()
    class HTMLEventTest4Element extends HTMLElement {
      @Event()
      onFoobar: EventEmitter<any>
    }

    const instance = new HTMLEventTest4Element();
    const data = {};
    instance.addEventListener("foobar", (ev: CustomEvent<any>) => {
      expect(ev.detail).toBe(data);
    });
    instance.onFoobar.emit(data);
  });

  it("should be able to emit cancelable events", () => {
    @Component()
    class HTMLEventTest5Element extends HTMLElement {
      @Event({ cancelable: true })
      onFoobar: EventEmitter<any>
    }

    const instance = new HTMLEventTest5Element();
    const data = {};
    instance.addEventListener("foobar", (ev: CustomEvent<any>) => {
      expect(ev.detail).toBe(data);
      ev.preventDefault();
    });
    expect(instance.onFoobar.emit(data)).toBeFalsy();
  });

  it("should have functionality to attach or detach handlers", () => {
    const spy = jasmine.createSpy();
    @Component()
    class HTMLEventTest6Element extends HTMLElement {
      @Event()
      onFoobar: EventEmitter<any>
    }

    const instance = new HTMLEventTest6Element();
    instance.onFoobar.attach(spy);
    expect(spy).toHaveBeenCalledTimes(0);
    instance.onFoobar.emit();
    expect(spy).toHaveBeenCalledTimes(1);
    instance.onFoobar.detach(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    instance.onFoobar.emit();
    expect(spy).toHaveBeenCalledTimes(1);
  })
});
