(function(exports) {

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

exports.reduced = reduced;
exports.distinct = distinct;

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

})(typeof exports !== "undefined" ?
    exports : this["koyo"] || (this["koyo"] = {}));
