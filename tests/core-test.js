/*global beforeEach, afterEach, describe, it*/

var expect = this.expect || module.require('expect.js');
var lively = this.lively || {}; lively.lang = lively.lang || module.require('lively.lang');
var immu = this["immu-js"] || module.require('../core.js');

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

describe("obj", function() {
  
  describe("clone", function() {
    
    it("clones", function() {
      var cloned = immu.clone(obj2);
      expect(cloned).eql(obj2);
      expect(cloned).not.equal(obj2);
    });
    
    it("does a shallow copy", function() {
      var cloned = immu.clone(obj1);
      expect(cloned).eql(obj1);
      expect(cloned.bar).equal(obj1.bar);
    })
  })

  it("getIn", function() {
    expect(24).equal(immu.getIn(obj1, ["bar", "baz"]));
  });

  it("update", function() {
    var updated = immu.update(obj1, "foo", function(val) { return val + 1; });
    expect(updated).not.equal(obj1);
    expect(updated.bar).equal(obj1.bar);
    expect(updated.foo).eql(24);
  });

  it("updateIn", function() {
    var seen,
        updated = immu.updateIn2(obj1, ["bar", "zork"], function(val) {
          seen = val; return 99; });
    expect(updated).eql({foo: 23, bar: {baz: 24, zork: 99}});
    expect(updated).not.equal(obj1);
  });

});

describe("collection", function() {

  it("reduced", function() {
    var result = immu.reduced([1,2,3,4], function(akk, ea) { return akk + ea; }, 0);
    expect(result).eql([1, 3, 6, 10]);
  });

});
