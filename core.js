// object:
// merge, assoc, assoc-in, disj, disj-in, selectKeys, renameKeys

(function(exports) {

exports.clone = clone;
exports.get = get;
exports.getIn = getIn;
exports.update = update;
exports.updateIn = updateIn;
exports.updateIn2 = updateIn2;

function clone(obj) {
  switch (typeof obj) {
    case "string":
    case "number":
    case "boolean": return obj;
  }

  var clone = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) clone[key] = obj[key];
  }
  return clone;
}

function update(obj, key, updater) {
  var cloned = clone(obj);
  cloned[key] = updater.call(null, obj[key]);
  return cloned;
}

function updateIn2(obj, keys, updater) {
  if (keys.length === 0) return obj;
  var cloned = clone(obj);
  cloned[keys[0]] = keys.length === 1 ?
    updater(obj[keys[0]]) :
    updateIn2(obj[keys[0]], keys.slice(1), updater);
  return cloned;
}

function updateIn(obj, keys, updater) {
  var i = 0,
      cloned = clone(obj),
      current = obj,
      currentClone = cloned;
  for (; i < keys.length-1; i++) {
    currentClone[keys[i]] = clone(current[keys[i]]);
    current = current[keys[i]];
    currentClone = currentClone[keys[i]];
  }
  currentClone[keys[i]] = updater(current[keys[i]]);
  return cloned;
}

function get(obj, key) { return obj[key]; }

function getIn(obj, keys) {
  for (var i = 0, current = obj; i < keys.length; i++) {
    if (!current) break
    current = current[keys[i]];
  }
  return current;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

exports.reduced = reduced;

function reduced(arr, fun, akk, context) {
  var results = [];
  arr.reduce(function(akk, ea) {
    akk = fun.call(context, akk, ea);
    results.push(akk);
    return akk;
  }, akk, context);
  return results;
}

})(typeof module !== "undefined" && module.exports ?
    module.exports : this["immu-js"] || (this["immu-js"] = {}));
