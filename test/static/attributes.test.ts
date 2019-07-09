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

});

describe("static > attributes > normalizeAttributes", () => {

});
