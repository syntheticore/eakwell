# eakwell.js
[![npm version](https://badge.fury.io/js/eakwell.svg)](http://badge.fury.io/js/eakwell) [![Build Status](https://travis-ci.org/syntheticore/eakwell.svg?branch=master)](https://travis-ci.org/syntheticore/eakwell) [![Dependency Status](https://david-dm.org/syntheticore/eakwell.svg)](https://david-dm.org/syntheticore/eakwell) [![Code Climate](https://codeclimate.com/github/syntheticore/eakwell/badges/gpa.svg)](https://codeclimate.com/github/syntheticore/eakwell)

Utility functions for arrays and objects alike, as a CommonJS module.

## Installation

    npm install eakwell --save

## Usage

  ```JavaScript
  var _ = require('eakwell');

  // Iterate through arrays
  _.each([1,2,3], function(value) {});
  
  // ..with index if you like
  _.each([5,6,7], function(value, index) {});
  
  // Iterate objects in the same way
  _.each({a: 'foo', b: 'bar'}, function(value, key) {});

  // Map arrays
  var doubles = _.map([1,2,3], function(n) { return n * 2 });
  
  // Index available if needed
  _.map([9,8,7], function(n, index) { return n });

  // Objects welcome too
  var ages = {
    Fred: 31,
    Anna: 24
  };
  var futureAges = _.map(ages, function(age) { return age + 20 });
  //=> {Fred: 51, Anna: 44}

  // When called with a string, we map directly to the items' members
  var names = _.map(people, 'name');

  // Call the given function <n> times
  _.times(2, function() { console.log('Hip') });
  console.log('Hooray');

  // Select a subset of items, that satisfy the given function
  var odds = _.select([1,2,3,4], function(n) { return n % 2 });

  // Check if all items match the given condition
  var doneDeal = _.all(books, function(book) { return book.price < 10 });

  // Check if at least one item matches the given condition
  var forbidden = _.any(people, function(person) { return person.age < 18 });

  // Check if the given item is a member of the array, object or string
  var hasFooInList = _.contains(['foo', 'bar'], 'foo');

  // For objects, the actual key where the value was found is returned
  var barKey = _.contains({foo: 1, bar: 2}, 2);

  // Call the named method on each item
  _.invoke(todos, 'delete');

  // Further arguments will get passed to the invoked method
  _.invoke(items, 'set', key, value);

  // Invoke returns an array of return values, similar to map
  var uppercased = _.invoke(['foo', 'bar'], 'toUpperCase');

  // Interleave the items of two arrays, stop on the shorter list
  var a = [1,2,3,7];
  var b = [4,5,6];
  _.zip(a, b); //=> [[1,4], [2,5], [3,6]]

  // Zip can be also be used with a callback 
  _.zip(a, b, function(fromA, fromB) {});

  // Make a flat array from a hierarchy of nested arrays
  _.flatten([1, [2, [3]], 4]); //=> [1,2,3,4]

  // Return new object with the fields from both given objects
  _.merge({a: 'foo'}, {b: 'bar'}); //=> {a: 'foo', b: 'bar'}

  // Merge two arrays
  var one2six = _.union([1,2,3], [4,5,6]); //=> [1,2,3,4,5,6]

  ```

## License

  MIT

