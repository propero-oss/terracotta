import "jasmine";
import {distinct, flatten, flattenAttribute, mergeObjects, delta} from "@/static";

describe("static > arrays > distinct", () => {
  it("filters any duplicate elements from arrays", () => {
    const cases: any = [{
      from: [0,1,2,0,1,2,0,1,2,0],
      to: [0,1,2]
    },{
      from: 'abcABCabcABC'.split(''),
      to: 'abcABC'.split('')
    }];

    cases.forEach(one => {
      expect(one.from.filter(distinct())).toEqual(one.to);
    });
  });
  it("filters any duplicate elements unsing a transformer", () => {
    const cases: any = [{
      from: ["HELLO", "Hello", "hello"],
      to: ["HELLO"],
      transformer: str => str.toLowerCase()
    }, {
      from: [1, 1.1, 2.5, 2.4, 3],
      to: [1, 2.5, 2.4],
      transformer: int => Math.round(int)
    }];

    cases.forEach(one => {
      expect(one.from.filter(distinct(one.transformer))).toEqual(one.to);
    });
  })
});

describe("static > arrays > flatten", () => {
  it("flattens a single level of arrays", () => {
    const value = [[],[1,2],[3],[4,5,6],[],[7],[8]];
    const expected = [1,2,3,4,5,6,7,8];
    expect(flatten(value)).toEqual(expected);
  });
});

describe("static > arrays > flattenAttribute", () => {
  it("flattens a single level of arrays looking up an attribute", () => {
    const value = [{
      arr: [1,2,3]
    },{
      arr: [4,5,6]
    }, {
      arr: []
    }, {}, {
      arr: [7]
    }];
    const expected = [1,2,3,4,5,6,7];
    expect(flattenAttribute(value, "arr")).toEqual(expected);
  });
});

describe("static > arrays > mergeObjects", () => {
  it("merges all source objects into one object", () => {
    const objects: any = [{
      foo: "bar"
    }, {
      bar: "foo",
      baz: 5
    }, undefined, {
      foo: true
    }];
    const expected = {
      foo: true,
      bar: "foo",
      baz: 5
    };
    expect(mergeObjects(objects)).toEqual(expected);
  });
});

describe("static > arrays > delta", () => {
  it("should return new elements", () => {
    const cases = [{
      from: [1,2,3,4],
      to: [1,2,3,4,5,6],
      added: [5,6]
    }];
    cases.forEach(one => {
      expect(delta(one.from, one.to).added).toEqual(one.added);
    });
  });
  it("should return old/removed elements", () => {
    const cases = [{
      from: [1,2,3,4],
      to: [3,4],
      removed: [1,2]
    }];
    cases.forEach(one => {
      expect(delta(one.from, one.to).removed).toEqual(one.removed);
    });
  });
  it("should return kept elements", () => {
    const cases = [{
      from: [1,2,3,4],
      to: [3,4],
      same: [3,4]
    }];
    cases.forEach(one => {
      expect(delta(one.from, one.to).same).toEqual(one.same);
    });
  });
  it("should process mixed content", () => {
    const cases = [{
      from: [1,2,3,4],
      to: [3,4,5,6],
      result: {
        added: [5,6],
        same: [3,4],
        removed: [1,2]
      }
    }];
    cases.forEach(one => {
      expect(delta(one.from, one.to)).toEqual(one.result);
    });
  })
});


