var koyo = window.koyo || this["koyo"] || module.require('../core.js');
var koyoAlt = window["koyo-alt"] || this["koyo-alt"] || module.require('../alternatives.js');

var runObject = false;
var runCollection = true;

var assoc =    koyo.assoc;
var clone =     koyo.clone;
var get =       koyo.get;
var getIn =     koyo.getIn;
var reduced =   koyo.reduced;
var update =    koyo.update;
var updateIn =  koyo.updateIn;
var updateIn2 = koyoAlt.updateIn;
var merge =  koyo.merge;
var merge2 = koyoAlt.merge;

var distinct = koyo.distinct;
var distinct2 = koyoAlt.distinct;

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

if (runObject) {

  lively.lang.fun.timeToRunN(function() {
    koyo.clone(obj1);
    koyo.clone(obj2);
    koyo.clone(obj3);
  }, 1000); // => 0.031
  
  
  lively.lang.fun.timeToRunN(function() {
    updateIn(obj1, ["bar", "zork", "aaa"], function(val) { return 99; });
    updateIn(obj3, obj3Keys.slice(0,-1), function(val) { return 99; });
  }, 1000) // => 0.086
  
  lively.lang.fun.timeToRunN(function() {
    updateIn2(obj1, ["bar", "zork", "aaa"], function(val) { return 99; });
    updateIn2(obj3, obj3Keys.slice(0,-1), function(val) { return 99; });
  }, 1000) // => 0.089
  
  lively.lang.fun.timeToRunN(function() {
    koyo.merge({foo: 23, bar: 24}, {bar: 25, baz: 26})
  }, 10000) // => 0.0009
  
  lively.lang.fun.timeToRunN(function() {
    koyo.merge2({foo: 23, bar: 24}, {bar: 25, baz: 26})
  }, 10000) // => 0.0034

}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

if (runCollection) {

  var arr0 = lively.lang.arr.range(0,10).concat(lively.lang.arr.range(0,5));
  var arr1 = lively.lang.arr.range(0,100).concat(lively.lang.arr.range(0,50));
  var arr2 = lively.lang.arr.range(0,1000).concat(lively.lang.arr.range(0,500));
  var arr3 = lively.lang.arr.shuffle(arr2);
  lively.lang.fun.timeToRunN(function() { distinct(arr0); }, 10000) // => 0.0015
  lively.lang.fun.timeToRunN(function() { distinct(arr1); }, 1000) // => 0.013
  lively.lang.fun.timeToRunN(function() { distinct(arr2); }, 100) // => 0.32
  lively.lang.fun.timeToRunN(function() { distinct(arr3); }, 100) // => 0.43
  
  lively.lang.fun.timeToRunN(function() { distinct2(arr0); }, 10000) // => 0.0011
  lively.lang.fun.timeToRunN(function() { distinct2(arr1); }, 1000) // => 0.012
  lively.lang.fun.timeToRunN(function() { distinct2(arr2); }, 100) // => 0.75
  lively.lang.fun.timeToRunN(function() { distinct2(arr3); }, 100) // => 0.87

}