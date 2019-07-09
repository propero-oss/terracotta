import "jasmine";
import {lock, locked, unlock} from "@/properties";
import {Stages} from "@/constants";

describe("properties > lock > lock", () => {
  it("should lock a property of an instance in a given state", () => {
    const instance = {};

    expect(locked(instance, "test")).toBeFalsy();
    lock(instance, "test", Stages.PROPERTY);
    expect(locked(instance, "test")).toBeTruthy();
    expect(locked(instance, "test")).toEqual(Stages.PROPERTY);
  });
});

describe("properties > lock > unlock", () => {
  it("should unlock a property of an instance", () => {
    const instance = {};

    expect(locked(instance, "test")).toBeFalsy();
    lock(instance, "test", Stages.PROPERTY);
    expect(locked(instance, "test")).toBeTruthy();
    expect(locked(instance, "test")).toEqual(Stages.PROPERTY);
    unlock(instance, "test");
    expect(locked(instance, "test")).toBeFalsy();
  });
});
