(function(exports) {

exports.headerImport = headerImport;
exports.headerGlobals = headerGlobals;

function headerImport(subset) {
  return "var " + (subset || Object.keys(exports))
    .map(function(k) { return k + " = koyo." + k})
    .join(",\n    ") + ";";
}

function headerGlobals() {
  return "/*global koyo, " + Object.keys(exports).join(", ") + "*/";
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

exports.clone     = clone;
exports.get       = get;
exports.getIn     = getIn;
exports.keys      = Object.keys;
exports.values    = values;
exports.update    = update;
exports.updateIn  = updateIn;
exports.merge     = merge;
exports.mergeWith = mergeWith;
exports.assoc     = assoc;
exports.assocIn   = assocIn;
exports.disj      = disj;
exports.disjIn    = disjIn;
exports.selectKeys = selectKeys;
exports.renameKeys = renameKeys;


function isPrimitive(obj) {
  if (!obj) return true;
  switch (typeof obj) {
    case "string":
    case "number":
    case "boolean": return true;
  }
  return false;
}

function clone(obj) {
  if (isPrimitive(obj)) return obj;
  if (Array.isArray(obj)) return obj.slice();
  var clone = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      clone[key] = obj[key];
  }
  return clone;
}

function values(obj) {
  return Object.keys(obj).map(function(k) { return obj[k]; });
}

function get(obj, key) { return obj[key]; }

function getIn(obj, keys) {
  for (var i = 0, current = obj; i < keys.length; i++) {
    if (!current) break
    current = current[keys[i]];
  }
  return current;
}

function assoc(obj, key, val) {
  var cloned = clone(obj);
  cloned[key] = val;
  return cloned;
}

function assocIn(obj, keys, val) {
  return updateIn(obj, keys, function(o) { return val; });
}

function disj(obj, key) {
  var cloned = clone(obj);
  delete cloned[key];
  return cloned;
}

function disjIn(obj, keys) {
  return updateIn(obj, keys.slice(0,-1), function(o) {
    delete o[keys[keys.length-1]];
    return o;
  });
}

function selectKeys(obj, keys) {
  var clone = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (obj.hasOwnProperty(key))
      clone[key] = obj[key];
  }
  return clone;
}

function renameKeys(obj, keysAndReplacements) {
  var clone = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var newKey = keysAndReplacements.hasOwnProperty(key) ?
        keysAndReplacements[key] : key;
      clone[newKey] = obj[key];
    }
  }
  return clone;
}

function update(obj, key, updater) {
  var cloned = clone(obj);
  cloned[key] = updater.call(null, obj[key]);
  return cloned;
}

function updateIn(obj, keys, updater) {
  var i = 0,
      cloned = clone(obj),
      current = cloned, val;
  for (var val; i < keys.length-1; i++) {
    val = current[keys[i]];
    if (isPrimitive(val)) val = {};
    else val = clone(val);
    current[keys[i]] = val;
    current = val;
  }
  current[keys[i]] = updater(current[keys[i]]);
  return cloned;
}

function merge(obj1, obj2) {
  var clone = {};
  for (var key in obj1) {
    if (obj1.hasOwnProperty(key)) clone[key] = obj1[key];
  }
  for (var key in obj2) {
    if (obj2.hasOwnProperty(key)) clone[key] = obj2[key];
  }
  return clone;
}

function mergeWith(obj1, obj2, fun) {
  var clone = {};
  for (var key in obj1) {
    if (obj1.hasOwnProperty(key)) clone[key] = obj1[key];
  }
  for (var key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      clone[key] = key in clone ?
        fun(key, obj2[key], clone[key]) : clone[key] = obj2[key]
    }
  }
  return clone;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

exports.toArray = toArray;
exports.range = range;
exports.map = map;
exports.mapcat = mapcat;
exports.flatten = flatten;
exports.mapKV = mapKV;
exports.mapGet = mapGet;
exports.mapCall = mapCall;
exports.keep = keep;
exports.filter = filter;
exports.reduce = reduce;
exports.reduced = reduced;
exports.distinct = distinct;

function toArray(iterable) {
  // Makes JS arrays out of array like objects like `arguments` or DOM `childNodes`
  if (!iterable) return [];
  if (Array.isArray(iterable)) return iterable;
  if (iterable.toArray) return iterable.toArray();
  var length = iterable.length,
      results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}

function range(begin, end, step) {
  // Examples:
  //   range(0,5) // => [0,1,2,3,4,5]
  //   range(0,10,2) // => [0,2,4,6,8,10]
  step = step || 1
  var result = [];
  for (var i = begin; i <= end; i += step)
    result.push(i);
  return result;
}

function map(iter, arr) {
  return arr.map(iter);
}

function mapcat(iter, arr) {
  return arr.reduce(function(all, ea, i) { return all.concat(iter(ea, i)); }, []);
}

function flatten(array) {
  // Turns a nested collection into a flat one.
  // Example:
  // arr.flatten([1, [2, [3,4,5], [6]], 7,8])
  // // => [1,2,3,4,5,6,7,8]
  return array.reduce(function(flattened, value) {
    return flattened.concat(Array.isArray(value) ?
      flatten(value) : [value]);
  }, []);
}

function mapKV(iter, obj) {
  return Object.keys(obj).map(function(k, i) { return iter(k, obj[k], i); });
}

function mapGet(key, arr) {
  return arr.map(function(ea) { return ea ? ea[key] : null; });
}

function mapCall(key, arr) {
  return arr.map(function(ea) {
    return ea && typeof ea[key] === 'function' ? ea[key]() : null;
  });
}

function keep(iter, arr) {
  return arr.reduce(function(all, ea, i) {
    var result = iter(ea, i);
    if (result !== null && result !== undefined && !isNaN(result))
      all.push(result);
    return all;
  }, []);
}

function filter(iter, arr) {
  return arr.filter(iter);
}

function reduce(iter, akk, arr) {
  return arr.reduce(iter, akk);
}

function reduced(arr, fun, akk, context) {
  var results = [];
  arr.reduce(function(akk, ea) {
    akk = fun.call(context, akk, ea);
    results.push(akk);
    return akk;
  }, akk, context);
  return results;
}

function distinct(arr) {
  if (arr.length < 300) {
    var seen = [];
    return arr.filter(function(ea) {
      var uniq = seen.indexOf(ea) === -1;
      if (!uniq) return false;
      seen.push(ea);
      return true;
    });
  } else {
    var seen = new Map();
    return arr.filter(function(ea) {
      if (seen.has(ea)) return false;
      seen.set(ea, true);
      return true;
    });
  }
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// juxt
// identity constantly memfn comp complement partial memoize fnil every-pred some-fn

exports.comp = comp;
exports.thread = thread;
exports.threadSome = threadSome;
exports.partial = partial;

function comp(/*functions*/) {
  // Composes synchronous functions:
  // `comp(h, g, f)(arg1, arg2)` = `h(g(f(arg1, arg2)))`
  // Example:
    // comp(
    //   function(x) {return x*4},
    //   function(a,b) { return a+b; }
    // )(3,2) // => 20

  var functions = Array.prototype.slice.call(arguments);
  return functions.reduce(
    function(prevFunc, func) {
      return function() {
        return prevFunc(func.apply(this, arguments));
      }
    }, function(x) { return x; });
}

function thread(/*functions*/) {
  var functions = Array.prototype.slice.call(arguments);
  var input = functions.shift();
  for (var i = 0; i < functions.length; i++) {
    var fn = functions[i];
    input = fn(input);
  }
  return input;
}

function threadSome(/*functions*/) {
  var functions = Array.prototype.slice.call(arguments);
  var input = functions.shift();
  for (var i = 0; i < functions.length; i++) {
    if (input === null || input === undefined || isNaN(input)) break;
    var fn = functions[i];
    input = fn(input);
  }
  return input;
}

function partial(func, arg1, arg2, argN/*func and curry args*/) {
  // Return a version of `func` with args applied.
  // Example:
  // var add1 = (function(a, b) { return a + b; }).curry(1);
  // add1(3) // => 4

  if (arguments.length <= 1) return arguments[0];
  var args = Array.prototype.slice.call(arguments),
      func = args.shift();
  function wrappedFunc() {
    return func.apply(this, args.concat(Array.prototype.slice.call(arguments)));
  }
  wrappedFunc.isWrapper = true;
  wrappedFunc.originalFunction = func;
  return wrappedFunc;
}

})(typeof exports !== "undefined" ?
    exports : this["koyo"] || (this["koyo"] = {}));
