import "jasmine";
import {classString, styleString, membersToPrefixedAttributes, normalizeAttributes} from "@/static";

describe("static > attributes > classString", () => {
  it("converts different attribute values into classes separated by space", () => {
    const cases = [{
      from: "foo bar",
      to: "foo bar"
    }, {
      from: ["foo", "bar"],
      to: "foo bar"
    }, {
      from: { foo: true, bar: true, baz: false },
      to: "foo bar"
    }, {
      from: undefined,
      to: ""
    }, {
      from: true,
      to: ""
    }, {
      from: 5,
      to: "5"
    }, {
      from: () => ["foo", "bar"],
      to: "foo bar"
    }];
    cases.forEach(one => expect(classString(one.from)).toEqual(one.to));
  });
});

describe("static > attributes > styleString", () => {
  it("converts different attribute values into style definitions", () => {
    const cases = [{
      from: "foo: bar",
      to: "foo: bar"
    }, {
      from: ["foo: bar", "bar: foo"],
      to: "foo: bar;bar: foo"
    }, {
      from: { foo: "bar", bar: "foo", baz: undefined },
      to: "foo:bar;bar:foo"
    }, {
      from: undefined,
      to: ""
    }, {
      from: true,
      to: ""
    }, {
      from: 5,
      to: "5"
    }, {
      from: () => ({foo: "bar"}),
      to: "foo:bar"
    }];
    cases.forEach(one => expect(styleString(one.from)).toEqual(one.to));
  });
});

describe("static > attributes > membersToPrefixedAttributes", () => {
  it("splits all members of an attribute into prefixed individual attributes", () => {
    const value = {
      data: { text: "hello", foo: "bar", fooBar: 5 },
      foo: { bar: "baz" }
    };
    const target = {};
    const expected = {
      "data-text": "hello",
      "data-foo": "bar",
      "data-foo-bar": 5
    };
    membersToPrefixedAttributes(target, value, "data");
    expect(target).toEqual(expected);
  });

  it("supports custom prefixes", () => {
    const value = {
      data: { text: "hello", foo: "bar", fooBar: 5 },
      foo: { bar: "baz" }
    };
    const target = {};
    const expected = {
      "test-text": "hello",
      "test-foo": "bar",
      "test-foo-bar": 5
    };
    membersToPrefixedAttributes(target, value, "data", "test");
    expect(target).toEqual(expected);
  })
});

describe("static > attributes > normalizeAttributes", () => {
  it("should normalize attributes", () => {
    const value = {
      data: { text: "hello", foo: "bar", fooBar: 5 },
      aria: { text: "hello", foo: "bar", fooBar: 5 },
      style() { return {
        display: "flex",
        flexDirection: "row"
      }; },
      class() { return ["foo", "bar"]; },
      foo: "bar"
    };
    const expected = {
      "data-text": "hello",
      "data-foo": "bar",
      "data-foo-bar": 5,
      "aria-text": "hello",
      "aria-foo": "bar",
      "aria-foo-bar": 5,
      "style": "display:flex;flex-direction:row",
      "class": "foo bar",
      "foo": "bar"
    };
    expect(normalizeAttributes(value)).toEqual(expected);
  });
});
