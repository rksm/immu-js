// object:
// merge, assoc, assoc-in, disj, disj-in, selectKeys, renameKeys

(function(exports, koyo) {

exports.updateIn = updateIn;
exports.merge = merge;

function updateIn(obj, keys, updater) {
  if (keys.length === 0) return obj;
  var cloned = clone(obj);
  cloned[keys[0]] = keys.length === 1 ?
    updater(obj[keys[0]]) :
    updateIn(obj[keys[0]], keys.slice(1), updater);
  return cloned;
}

function merge(obj1, obj2) {
  var clone = {};
  var keys = distinct(Object.keys(obj1).concat(Object.keys(obj2)));
  for (var i = 0; i < keys.length; i++) {
    if (obj2.hasOwnProperty(keys[i])) clone[keys[i]] = obj2[keys[i]];
    else if (obj1.hasOwnProperty(keys[i])) clone[keys[i]] = obj1[keys[i]];
  }
  return clone;
}

exports.distinct = distinct;

function distinct(arr) {
  var seen = [];
  return arr.filter(function(ea) {
    var uniq = seen.indexOf(ea) === -1;
    if (!uniq) return false;
    seen.push(ea);
    return true;
  });
}


})(typeof exports !== "undefined" ?
    exports : this["koyo-alt"] || (this["koyo-alt"] = {}),
   typeof module !== "undefined" && module.require ?
    module.require("./core.js") : this.koyo);
