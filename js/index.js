/*global console: false */
'use strict';
console.log('hello');
var f = x => 2*x;
console.log(f(5));

// destructuring with default 
function g({x = 6}) {
	console.log('x', x);
}

// destructuring with default for intermediate value
function h({x: {y} = {}}) {
	console.log('y', y);
}

g({x: 10});
g({});
h({x: {y: 7}});
h({});
h({x: {z: 12}});
h({x: {y: 12}});
