require('chai').should();
var _ = require('../eakwell.js');


describe('#all()', function() {
  it('returns true if all conditions hold', function() {
    _.all([1, 2, 3], function(n) {
      return n > 0;
    }).should.be.true;
  });

  it('returns false if any conditions fails', function() {
    _.all([-1, 2, -3], function(n) {
      return n < 0;
    }).should.be.false;
  });
});

describe('#any()', function() {
  it('returns true if any item matches the condition', function() {
    _.any([1, 2, 3], function(n) {
      return n > 1;
    }).should.be.true;
  });

  it('returns false if no item matches the condition', function() {
    _.any([1, 2, 3], function(n) {
      return n > 10;
    }).should.be.false;
  });
});

describe('#zip()', function() {
  it('returns as many pairs as the shorter list has items', function() {
    var count = 0;
    _.zip([1, 3], [2, 4, 5], function(n1, n2) {
      count++;
    }).length.should.equal(2);
    count.should.equal(2);

    var count = 0;
    _.zip([1, 3, 5], [2, 4], function(n1, n2) {
      count++;
    }).length.should.equal(2);
    count.should.equal(2);
  });

  it('should zip elements', function() {
    _.zip([1, 3], [2, 4]).should.eql([[1, 2], [3, 4]]);
  });
});

describe('#union()', function() {
  it('returns new object containing the values of both arguments', function() {
    _.union([1, 2], [3, 4]).should.eql([1, 2, 3, 4]);
  });
});

describe('#merge()', function() {
  it('return a new object with fields from both arguments', function() {
    _.merge({a: 1}, {b: 2}).should.eql({a: 1, b: 2});
  });

  it('should prefer values from the second object', function() {
    _.merge({a: 1, b: 3}, {a: 2}).should.eql({a: 2, b: 3});
  });
});

describe('#map()', function() {
  it('returns a list of mutated values', function() {
    _.map([1, 2], function(n) {
      return n * 2;
    }).should.eql([2, 4]);
  });
});

describe('#select()', function() {
  it('returns a list of filtered values from an array', function() {
    _.select([1, 2, 3, 4], function(n) {
      return n % 2 == 0;
    }).should.eql([2, 4]);
  });

  it('returns a list of filtered values from an object', function() {
    _.select({a: 1, b: 2, c: 3}, function(n, key) {
      return n % 2 == 0;
    }).should.eql({b: 2});
  });

  it('returns no more than <max> items', function() {
    _.select([1, 2, 3, 4], function(n) {
      return true;
    }, 2).length.should.equal(2);
  });
});

describe('#pick()', function() {
  var items = [1, 2, 3, 4];
  it('returns a random element', function() {
    items.should.contain(_.pick(items));
  });

  it('returns no duplicates', function() {
    var few = _.pick(items, 4);
    few.should.have.length(4);
    few.should.not.equal(items);
    _.all(few.sort(), function(item, i) {
      return item != few[i - 1]
    }).should.be.true;
  });
});

describe('#difference()', function() {
  var items1 = [1, 2, 3, 4];
  var items2 = [      3, 4, 5, 6];
  it('returns elements exclusive to only one of the arrays', function() {
    _.difference(items1, items2).should.eql([1,2,5,6]);
  });
});
