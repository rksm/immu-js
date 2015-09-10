var assoc1 =    immu.assoc1;
var clone =     immu.clone;
var clone1 =    immu.clone1;
var clone2 =    immu.clone2;
var get =       immu.get;
var getIn =     immu.getIn;
var reduced =   immu.reduced;
var update =    immu.update;
var updateIn =  immu.updateIn;
var updateIn2 = immu.updateIn2;

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


lively.lang.fun.timeToRunN(function() {
  Global.immu.clone(obj1);
  Global.immu.clone(obj2);
  Global.immu.clone(obj3);
}, 1000); // => 0.177


lively.lang.fun.timeToRunN(function() {
  updateIn(obj1, ["bar", "zork", "aaa"], function(val) { return 99; });
  updateIn(obj3, obj3Keys.slice(0,-1), function(val) { return 99; });
}, 1000) // => 0.337

lively.lang.fun.timeToRunN(function() {
  updateIn2(obj1, ["bar", "zork", "aaa"], function(val) { return 99; });
  updateIn2(obj3, obj3Keys.slice(0,-1), function(val) { return 99; });
}, 1000) // => 0.442
