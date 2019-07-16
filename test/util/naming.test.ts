import "jasmine";
import {toKebapCase} from "@/util";

describe("util > naming > toKebapCase", () => {
  it("converts PascalCase to kebap-case", () => {
    const values = {
      "PascalCase": "pascal-case",
      "SomethingElse": "something-else",
      "FooBarBaz": "foo-bar-baz",
      "HTMLDivElement": "html-div-element",
      "HttpURLConnection": "http-url-connection",
      "Foo1Bar2Baz": "foo1-bar2-baz",
    };

    Object.entries(values).forEach(([value, expected]) => {
      expect(toKebapCase(value)).toEqual(expected);
    });
  });
  it("converts camelCase to kebap-case", () => {
    const values = {
      "camelCase": "camel-case",
      "somethingElse": "something-else",
      "fooBarBaz": "foo-bar-baz",
      "htmlDivElement": "html-div-element",
      "httpURLConnection": "http-url-connection",
      "foo1Bar2Baz": "foo1-bar2-baz",
    };

    Object.entries(values).forEach(([value, expected]) => {
      expect(toKebapCase(value)).toEqual(expected);
    });
  });
});
