/*global describe: false, it: false, require: false */
"use strict";
var _ = require('underscore');
var eh = require('../js/index').init(_);
_.mixin(eh);
var assert = require('assert');

describe('ehmutable', function () {
	describe('#assoc', function () {
		it('should assign to key', function() {
			assert.deepEqual(_.assoc({a: 3}, 'b', [2]), {a:3, b: [2]});
		});
		it('should handle null input', function() {
			assert.deepEqual(_.assoc(null, 'x', 5), {x: 5});
		});
		it('should update existing key', function() {
			assert.deepEqual(_.assoc({a: 3}, 'a', '4'), {a: 4});
		});
		it('should work with array', function() {
			assert.deepEqual(_.assoc([1, 3], 0, 4), [4, 3]);
		});
		it('should handle multiple keys', function() {
			assert.deepEqual(_.assoc({a: 3}, 'b', 2, 'c', 5), {a: 3, b: 2, c: 5});
		});
		it('should preserve identity', function() {
			var x = {a: 3};
			assert.strictEqual(_.assoc(x, 'a', 3), x);
		});
		it('should preserve array identity', function() {
			var x = [2, 3];
			assert.strictEqual(_.assoc(x, 0, 2), x);
		});
	});
	describe('#get', function () {
		it('should handle null', function() {
			assert.deepEqual(_.get(null, 'x'), undefined);
		});
		it('should gey key', function() {
			assert.deepEqual(_.get({a: 3}, 'a'), 3);
		});
		it('should handle missing key', function() {
			assert.deepEqual(_.get({a: 3}, 'b'), undefined);
		});
		it('should use default', function() {
			assert.deepEqual(_.get({a: 3}, 'b', 6), 6);
		});
		it('should work with array', function() {
			assert.deepEqual(_.get([2, 4], 1), 4);
		});
	});
	describe('#dissoc', function () {
		it('should remove key', function() {
			assert.deepEqual(_.dissoc({a: 3, b: 5}, 'a'), {b: 5});
		});
		it('should preserve identity', function() {
			var x = {a: 3};
			assert.strictEqual(_.dissoc(x, 'b'), x);
		});
	});
	describe('#conj', function () {
		it('should add to array', function() {
			assert.deepEqual(_.conj([2, 3], 5), [2, 3, 5]);
		});
		it('should add pair to object', function() {
			assert.deepEqual(_.conj({'a': 3}, ['b', 5]), {a: 3, b: 5});
		});
	});
	describe('#assocIn', function () {
		it('should assign to nested value', function() {
			assert.deepEqual(_.assocIn(['x', {a: 3}], [1, 'a'], 5), ['x', {a: 5}]);
		});
		it('should create itermediate objects', function() {
			assert.deepEqual(_.assocIn({a: 3}, ['b', 'c'], 5), {a: 3, b: {c: 5}});
		});
		it('should do multiple assignments', function() {
			assert.deepEqual(_.assocIn({a: 3}, ['b', 'c'], 5, ['a'], 7), {a: 7, b: {c: 5}});
		});
		it('should preserve identity', function() {
			var x = {a: 3, b: {c: 3}};
			assert.strictEqual(_.assocIn(x, ['b', 'c'], 3), x);
		});
		it('should work on empty key path', function() {
			assert.deepEqual(
				_.assocIn({a: 3, b: 7}, [], {z: 7}),
				{z: 7});
		});
	});
	describe('#updateIn', function () {
		it('should update nested value', function() {
			assert.deepEqual(_.updateIn({a: 3, b: [1, 2]}, ['b', 1], x => x + 1), {a: 3, b: [1, 3]});
		});
		it('should preserve identity', function() {
			var x = {a: 3, b: {c: 3}};
			assert.strictEqual(_.updateIn(x, ['b', 'c'], x => x), x);
		});
		it('should do multiple updates', function() {
			assert.deepEqual(_.updateIn({a: 3, b: 7},
					['a'], x => x + 1, ['b'], x => x - 1), {a: 4, b: 6});
		});
		it('should work on empty key path', function() {
			assert.deepEqual(
				_.updateIn({a: 3, b: 7}, [], x => _.dissoc(x, 'b')),
				{a: 3});
		});
	});
	describe('#getIn', function () {
		it('should return nested value', function() {
			assert.deepEqual(_.getIn({a: 3, b: [1, 3]}, ['b', 1]), 3);
		});
		it('should use default', function() {
			assert.deepEqual(_.getIn({a: 3, b: [1, 3]}, ['a', 'x'], -1), -1);
		});
	});
});
