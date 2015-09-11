/*global beforeEach, afterEach, describe, it*/

var expect = this.expect || module.require('expect.js');
var lively = this.lively || {}; lively.lang = lively.lang || module.require('lively.lang');
var koyo = this.koyo || module.require('../core.js');

// simple object
var obj1 = {foo: 23, bar: {baz: 24, zork: {aaa: 25}}};

// "wide" object
function makeKey() { return lively.lang.arr.range(0,5).map(function() { return String.fromCharCode(lively.lang.num.random(97,122)) }).join(""); }
var obj2 = {};
lively.lang.arr.range(0,50).forEach(function(i) { obj2[makeKey()] = i; });

// "deep" object
var obj3Keys = lively.lang.arr.range(0,100).map(makeKey);
var obj3 = obj3Keys.reduceRight(function(obj, key) {
  var newObj = {}; newObj[key] = obj; return newObj; });

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

var clone     = koyo.clone;
var getIn     = koyo.getIn;
var update    = koyo.update;
var updateIn  = koyo.updateIn;
var merge     = koyo.merge;
var mergeWith = koyo.mergeWith;
var assoc     = koyo.assoc;
var reduced   = koyo.reduced;
var assoc     = koyo.assoc;
var assocIn   = koyo.assocIn;
var disj      = koyo.disj;
var disjIn    = koyo.disjIn;
var selectKeys = koyo.selectKeys;
var renameKeys = koyo.renameKeys;

describe("obj", function() {

  describe("clone", function() {
    
    it("clones", function() {
      var cloned = clone(obj2);
      expect(cloned).eql(obj2);
      expect(cloned).not.equal(obj2);
    });
    
    it("does a shallow copy", function() {
      var cloned = clone(obj1);
      expect(cloned).eql(obj1);
      expect(cloned.bar).equal(obj1.bar);
    });

    it("clones arrays", function() {
      var arr = [1,2,3], cloned = clone(arr);
      expect(cloned).to.be.an("array")
      expect(cloned).eql(arr);
      expect(arr).to.not.equal(cloned);
    });
    
  });

  describe("get", function() {

    it("retrieves", function() {
      expect(23).equal(koyo.get(obj1, "foo"));
    });

    it("can do nested get with getIn", function() {
      expect(24).equal(getIn(obj1, ["bar", "baz"]));
    });
  })

  describe("update", function() {
    
    it("returns changed copy", function() {
      var updated = update(obj1, "foo", function(val) { return val + 1; });
      expect(updated).not.equal(obj1);
      expect(updated.bar).equal(obj1.bar);
      expect(updated.foo).eql(24);
    });
  
    it("can change nested properties with updateIn", function() {
      var updated = updateIn(obj1, ["bar", "zork"], function(val) { return 99; });
      expect(updated).eql({foo: 23, bar: {baz: 24, zork: 99}});
      expect(updated).not.equal(obj1);
    });

  });

  describe("merge", function() {
    it("combines objects left to right", function() {
      expect(merge({foo: 23, bar: 24}, {bar: 25, baz: 26}))
        .eql({foo:23, bar: 25, baz: 26});
    });

    it("combines objects with a function", function() {
      expect(mergeWith(
          {foo: 23, bar: 24}, {bar: 25, baz: 26},
          function(key, val1, val2) { return key + (val1 + val2); }))
        .eql({foo:23, bar: "bar49", baz: 26});
    });
  });

  describe("assoc", function() {

    var o = {foo: 23, bar: 24};

    it("adds attributes", function() {
      var result = assoc(o, "xxx", 45);
      expect(result).eql({foo: 23, bar: 24, xxx: 45});
      expect(o).to.not.have.property("xxx");
      expect(o).to.not.equal(result);
    });

    it("overwrites attributes", function() {
      expect(assoc(o, "foo", 45)).eql({foo: 45, bar: 24});
    });
    
    it("overwrites path", function() {
      expect(koyo.assocIn(o, ["foo", "bar"], 23))
        .eql({foo: {bar: 23}, bar: 24});
    });

    it("nested", function() {
      expect(koyo.assocIn(obj1, ["bar", "zork", "xxx"], 45).bar.zork.xxx).equal(45);
      expect(assocIn(o, ["foo"], 24)).eql({foo: 24, bar: 24})
    });

    it("creates refs", function() {
      expect(assocIn({}, ["foo", "bar", "baz"], 23))
        .eql({foo: {bar: {baz: 23}}});
    });

    it("works with arrays", function() {
      expect(assoc([1,2,3], 1, 23)).eql([1,23,3]);
    });

    it("works with arrays nested", function() {
      var result = koyo.assocIn([], [2, 1, "bar", "baz"], 23);
      expect(result).to.be.an("array");
      expect(result[0]).equal(undefined);
      expect(result[1]).equal(undefined);
      expect(result[2]).to.not.be.an("array");
      expect(result[2]).eql({"1": {bar: {baz: 23}}});
      expect(result[3]).equal(undefined);
    });

  });

  describe("disj", function() {

    it("filters attributes", function() {
      expect(disj({foo: 23, bar: {baz: 123}}, "bar")).eql({foo: 23});
      expect(disj({foo: 23}, "foo")).to.not.have.own.property("foo");
    });

    it("filters attributes nested", function() {
      expect(disjIn({foo: 23, bar: {baz: 123}}, ["bar", "baz"])).eql({foo: 23, bar: {}});
    });

  });

  describe("selectKeys", function() {

    it("returns subset of object", function() {
      expect(selectKeys({foo: 23, bar: {baz: 123}, zork: 99}, ["foo", "zork"]))
        .eql({foo: 23, zork: 99});
    });

  });

  describe("renameKeys", function() {

    it("renames keys...", function() {
      expect(renameKeys(
        {foo: 23, bar: {baz: 123}, zork: 99},
        {"bar": "xxx", "zork": "yyy"}))
        .eql({foo: 23, xxx: {baz: 123}, yyy: 99});
    });

  });
});

describe("collection", function() {

  it("reduced", function() {
    var result = reduced([1,2,3,4], function(akk, ea) { return akk + ea; }, 0);
    expect(result).eql([1, 3, 6, 10]);
  });

});
