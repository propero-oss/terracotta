
import "jasmine";
import {getParser, defaultAttributeProcessor} from "@/properties";

describe("properties > parsing > defaultAttributeProcessor", () => {
  it("should fetch registered processors", () => {
    const parser = defaultAttributeProcessor("parser");
    const serializer = defaultAttributeProcessor("serializer");

    expect(parser("true", null, "prop", Boolean)).toEqual(true);
    expect(parser("5", null, "prop", Number)).toEqual(5);
    expect(serializer(true, null, "prop", Boolean)).toEqual(true);
    expect(serializer(5, null, "prop", Number)).toEqual("5");
  });
  it("should throw for unregistered types", () => {
    const parser = defaultAttributeProcessor("parser");
    const serializer = defaultAttributeProcessor("serializer");
    expect(() => parser("test", null, "prop", class MyClass {}))
      .toThrowError("No parser registered for type MyClass.");
    expect(() => serializer("test", null, "prop", class MyClass {}))
      .toThrowError("No serializer registered for type MyClass.");
  })
});

describe("properties > parsing > getParser", () => {
  it("should parse booleans", () => {
    const {parser, serializer} = getParser(Boolean);

    expect(parser("false", null, "prop", Boolean)).toBeFalsy();
    expect(parser("", null, "prop", Boolean)).toBeFalsy();
    expect(parser(null, null, "prop", Boolean)).toBeFalsy();
    expect(parser(undefined, null, "prop", Boolean)).toBeFalsy();
    expect(parser(false, null, "prop", Boolean)).toBeFalsy();

    expect(parser("true", null, "prop", Boolean)).toBeTruthy();
    expect(parser("anything", null, "prop", Boolean)).toBeTruthy();
    expect(parser(1, null, "prop", Boolean)).toBeTruthy();
    expect(parser(true, null, "prop", Boolean)).toBeTruthy();

    expect(serializer(true, null, "prop", Boolean)).toBeTruthy();
    expect(serializer(false, null, "prop", Boolean)).toBeFalsy();
  });

  it("should parse strings", () => {
    const {parser, serializer} = getParser(String);

    expect(parser("", null, "prop", String)).toEqual("");
    expect(parser("test", null, "prop", String)).toEqual("test");
    expect(parser(null, null, "prop", String)).toEqual(undefined);
    expect(parser("  space  ", null, "prop", String)).toEqual("  space  ");

    expect(serializer("", null, "prop", String)).toEqual("");
    expect(serializer(undefined, null, "prop", String)).toBeUndefined();
    expect(serializer("test", null, "prop", String)).toEqual("test");
    expect(serializer("  space  ", null, "prop", String)).toEqual("  space  ");
  });

  it("should parse numbers", () => {
    const {parser, serializer} = getParser(Number);

    expect(parser("", null, "prop", Number)).toEqual(0);
    expect(parser("1", null, "prop", Number)).toEqual(1);
    expect(parser("1e1", null, "prop", Number)).toEqual(10);
    expect(parser("-5", null, "prop", Number)).toEqual(-5);
    expect(parser("2.5", null, "prop", Number)).toEqual(2.5);
    expect(parser(".5", null, "prop", Number)).toEqual(.5);
    expect(parser(null, null, "prop", Number)).toBeUndefined();

    expect(serializer(5, null, "prop", Number)).toEqual("5");
    expect(serializer(0, null, "prop", Number)).toEqual("0");
  });

  it("should parse dates", () => {
    const {parser, serializer} = getParser(Date);
    const dtString = "2017-05-02T02:00:00.000Z";

    expect(parser(dtString, null, "prop", Date)).toEqual(new Date(dtString));
    expect(parser(undefined, null, "prop", Date)).toBeUndefined();

    const today = new Date();
    expect(serializer(today, null, "prop", Date)).toEqual(today.toISOString());
    expect(serializer(undefined, null, "prop", Date)).toBeUndefined();
  });

  it("should parse regexps", () => {
    const {parser, serializer} = getParser(RegExp);

    expect(parser("[A-Za-z0-9]*", null, "prop", RegExp)).toEqual(/[A-Za-z0-9]*/);
    expect(parser(undefined, null, "prop", RegExp)).toBeUndefined();

    expect(serializer(/[A-Za-z0-9]*/, null, "prop", RegExp)).toEqual("[A-Za-z0-9]*");
    expect(serializer(undefined, null, "prop", RegExp)).toBeUndefined();
  });
});
