/*global require: false, module: false */
'use strict';

var isEqual;

var hasOwnProperty = Object.prototype.hasOwnProperty,
	slice = Array.prototype.slice;

function assert(test, msg) {
	if (!test) {
		throw new Error(msg);
	}
}

function has(obj, prop) {
	return hasOwnProperty.call(obj, prop);
}

// Immutable collection operations, based on doing a naive
// path copy. Should be performant for objects that are not
// too large, and nesting not too deep.

function arrAssoc(x, k, v) {
	var y;
	if (k < 0 || k > x.length) {
		throw new Error('Index ' + k + ' out of bounds [0,' + x.length + ']');
	}
	y = [].concat(x);
	y[k] = v;
	return y;
}

function objAssoc(x, k, v) {
	var y = {}, i;
	x = x || {};
	for (i in x) {
		if (has(x, i)) {
			y[i] = x[i];
		}
	}
	y[k] = v;
	return y;
}

function dissoc(x, k) {
	if (!has(x, k)) { // avoid new object if we can.
		return x;
	}
	var y = {}, i;
	for (i in x) {
		if (has(x, i) && i !== k) {
			y[i] = x[i];
		}
	}
	return y;
}

function assoc1(x, k, v) {
	if (x && isEqual(x[k], v)) { // avoid new object if we can.
		return x;
	}
	if (x instanceof Array) {
		return arrAssoc(x, k, v);
	}
	return objAssoc(x, k, v);
}

function assoc(x) {
	var kvs;

	for (kvs = slice.call(arguments, 1); kvs.length; kvs = kvs.slice(2)) {
		x = assoc1(x, kvs[0], kvs[1]);
	}
	return x;
}

function assocInI(x, keys, v, i) {
	var ki = keys[i];
	if (keys.length === i) {
		return v;
	}
	return assoc(x, ki, assocInI(x && x[ki], keys, v, i + 1));
}

function assocIn(x, keys, v) {
	assert(keys instanceof Array, 'keys should be an array');
	return assocInI(x, keys, v, 0);
}

function assocInAll(x) {
	var kvs;

	for (kvs = slice.call(arguments, 1); kvs.length; kvs = kvs.slice(2)) {
		x = assocIn(x, kvs[0], kvs[1]);
	}
	return x;
}

function conj(x, v) {
	if (x instanceof Array) {
		return assoc(x, x.length, v);
	}
	return assoc(x, v[0], v[1]);
}

function updateInI(x, keys, fn, i) {
	var ki = keys[i];
	if (keys.length === i) {
		return fn(x);
	}
	return assoc(x, ki, updateInI(x && x[ki], keys, fn, i + 1));
}

function updateIn(x, keys, fn) {
	assert(keys instanceof Array, 'keys should be an array');
	return updateInI(x, keys, fn, 0);
}

function updateInAll(x) {
	var kvs;

	for (kvs = slice.call(arguments, 1); kvs.length; kvs = kvs.slice(2)) {
		x = updateIn(x, kvs[0], kvs[1]);
	}
	return x;
}

function getInI(x, keys, i, def) {
	var ki;

	if (x === null || x === undefined) {
		return def;
	}
	ki = keys[i];
	if (keys.length === i + 1) {
		return x.hasOwnProperty(ki) ? x[ki] : def;
	}
	return getInI(x[ki], keys, i + 1, def);
}

function getIn(x, keys, def) {
	assert(keys instanceof Array, 'keys should be an array');
	if (keys.length === 0) {
		return x;
	}
	return getInI(x, keys, 0, def);
}

function get(x, key, def) {
	return (x != null && x.hasOwnProperty(key)) ? x[key] : def;
}

var methods = {
	assoc: assoc,
	assocIn: assocInAll,
	assocInAll: assocInAll,
	dissoc: dissoc,
	updateIn: updateInAll,
	conj: conj,
	get: get,
	getIn: getIn
}

module.exports = {
	...methods,
	init: obj => {
		isEqual = obj.isEqual
		return methods;
	}
};
