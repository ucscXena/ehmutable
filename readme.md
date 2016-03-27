# Eh? mutable.

A javascript library for when you feel you probably should be using mori, or
immutablejs, but you have a bunch of existing code, hot loops that can't afford
a performance hit, or other nagging concerns, so you do a naive path copy
of plain mutable javascript objects, instead.

Vaguely clojurish in shape, APIs for updating javascript collections (array,
object) by doing a naive path copy. This is performant enough if the
collecitons being updated are not too deep, or too long.  You wouldn't want to
add elements to the end of an array of thousands of elements, for example,
using these methods, since every append would copy the entire array.

One slight difference from other immutable helpers: these methods avoid creating
a new object if it would be identical (by deep equal) to the original object.

```javascript
var x = {a: 5, b: 6};
x === _.assoc(x, 'a', 5); // -> true
```

The equality check is performed on the value being assigned. In the example above,
the check is ```5 === 5```, rather than against the value of ```x```.

This behavior is, perhaps, a bit wonky. The idea is that if the data is being
repeatedly checked for equality (e.g. in a react component
```shouldComponentUpdate``` method), it's cheaper to do the check once, during
data update, so that subsequent compares can be done with reference equality.

This requires a deep equality check, which the user must inject into the module.

```javascript
var eh = require('ehmutable');
eh.init({isEqual: deepEqual});
```

or

```javascript
var eh = require('ehmutable').init({isEqual: deepEqual});
```

To use the underscore or lodash methods,

```javascript
var eh = require('ehmutable').init(_);
```

This is a persistent setting, which only needs to be done once.

In the examples below, it is assumed that the methods appear on object
```_```, which you might do by mixing them in to underscore or lodash.

## Methods

### assoc
Assign to a key on an object or array. Multiple key/value pairs may
be given.
```javascript
_.assoc(null, 'x', 5); // -> {x: 5}
_.assoc({a: 3}, 'b', [2]); // -> {a: 3, b: [2]}
_.assoc({a: 3}, 'a', '4'); // -> {a: 4}
_.assoc([1, 3], 0, 4); // -> [4, 3]
_.assoc({a: 3}, 'b', 2, 'c', 5); // -> {a: 3, b: 2, c: 5}
```

### get
Return the value of a key, or a default, on an object or array. Returns
undefined if the object or the key doesn't exist and no default was provided.
```javascript
_.get(null, 'x'); // -> undefined
_.get({a: 3}, 'a'); // -> 3
_.get({a: 3}, 'b'); // -> undefined
_.get({a: 3}, 'b', 6); // -> 6
_.get([2, 4], 1); // -> 4
```

### dissoc
Remove a key from an object.
```javascript
_.dissoc({a: 3, b: 5}, 'a'); // -> {b: 5}
```

### conj
Append a value to an object or array.
```javascript
_.conj([2, 3], 5); // -> [2, 3, 5]
_.conj({'a': 3}, ['b', 5]); // -> {a: 3, b: 5}
```

### assocIn
Assign to a path in a nested structure. Creates objects as needed.
Mutiple path/values may be given.
```javascript
_.assocIn(['x', {a: 3}], [1, 'a'], 5); // -> ['x', {a: 5}]
_.assocIn({a: 3}, ['b', 'c'], 5); // -> {a: 3, b: {c: 5}}
_.assocIn({a: 3}, ['b', 'c'], 5, ['a'], 7); // -> {a: 7, b: {c: 5}}
```

### updateIn
Update a path in a nested structure, with a function.
```javascript
_.updateIn({a: 3, b: [1, 2]}, ['b', 1], x => x + 1); // -> {a: 3, b: [1, 3]}
```

### getIn
Return the value at a path in a nested structure, or a default.
```javascript
_.getIn({a: 3, b: [1, 3]}, ['b', 1]); // -> 3
_.getIn({a: 3, b: [1, 3]}, ['a', 'x'], -1); // -> -1
```

## Build
The build is based on npm and webpack.
 * Ensure that git and node are installed
   * On OSX, install brew http://brew.sh/
   * `brew install git`
   * `brew install node`
 * `git clone https://github.com/acthp/ehmutable.git`
 * `cd ehmutable`
 * `npm install`
 * `npm start`
 * browse to [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/)

### Lint

Use `npm run lint` to run the lint rules. We lint with eslint and babel-eslint.

### References
 * http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/
 * http://webpack.github.io/
 * http://www.youtube.com/watch?v=VkTCL6Nqm6Y
