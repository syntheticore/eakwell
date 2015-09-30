"use strict";

var rsvp = require('rsvp');

var _ = module.exports = {

  // Empty placeholder function
  noop: function() {},

  // Loop through objects and arrays
  // Return something truthy from callback to stop iteration
  each: function(items, cb) {
    if(items && items.length != undefined) {
      for(var i = 0; i < items.length; i++) {
        var cancel = cb(items[i], i);
        if(cancel) return cancel;
      }
    } else {
      for(var key in items) {
        if(items.hasOwnProperty(key)) {
          var cancel = cb(items[key], key);
          if(cancel) return cancel;
        }
      }
    }
    return false;
  },

  // Return a copy of the given array
  // with each item replaced according to <cbOrName>
  map: function(items, cbOrName) {
    var out = (!items || items.length != undefined ? [] : {});
    var callback = (typeof cbOrName === 'function');
    _.each(items, function(item, key) {
      out[key] = (callback ? cbOrName(item, key) : item[cbOrName]);
    });
    return out;
  },

  // Call the given function <n> times
  times: function(n, cb) {
    for(var i = 0; i < n; i++) {
      cb(i);
    }
  },

  // Invoke the named method on each item
  // Additional arguments will be passed to the invoked methods
  invoke: function(items, key) {
    var out = [];
    var args = Array.prototype.slice.call(arguments).splice(2);
    _.each(items, function(item) {
      out.push(item[key].apply(item, args));
    });
    return out;
  },

  // Interleave the items of two arrays
  zip: function(items1, items2, cb) {
     var out = [];
    _.each(items1, function(item1, i) {
      var item2 = items2[i];
      if(item2 == undefined) return true;
      out.push([item1, item2]);
      cb && cb(item1, item2);
    });
    return out;
  },

  // Make a flat array from a hierarchy of nested arrays
  flatten: function(items) {
    var out = [];
    _.each(items, function(item) {
      if(Array.isArray(item)) {
        var flat = _.flatten(item);
        out.push.apply(out, flat);
      } else {
        out.push(item);
      }
    });
    return out;
  },

  // Select items from an array or object that match the given condition
  select: function(items, cb, n) {
    var ary = (items && items.length != undefined);
    var out = ary ? [] : {};
    var i = 0;
    _.each(items, function(item, key) {
      if(cb(item, key)) {
        if(ary) {
          out.push(item);
        } else {
          out[key] = item;
        }
      }
      if(n && ++i == n) return true;
    });
    return out;
  },

  // Return the number of items that match the given condition
  count: function(items, cb) {
    return _.select(items, cb).length;
  },

  // Check if all items match the given condition
  all: function(items, cb) {
    return _.count(items, cb) == items.length;
  },

  // Check if any item matches the given condition
  any: function(items, cb) {
    return _.each(items, cb);
  },

  // Return the first element from <items> that matches the given condition
  find: function(items, cb) {
    return _.each(items, function(item) {
      if(cb(item)) return item;
    });
  },

  // Return the last element of the given array or string
  last: function(items) {
    return items[items.length - 1];
  },

  // Randomly pick either a single item, or an array of <n> items
  // Individual items get picked at most once
  pick: function(items, n) {
    var i = Math.floor(Math.random() * items.length);
    if(n != undefined) {
      items = _.clone(items);
      return n == 0 ? [] : _.union(items.splice(i, 1), _.pick(items, n - 1));
    } else {
      return items[i];
    }
  },

  // Check if <item> is a member of the given array, object or string
  // Return the key where <item> was found if <items> is an object
  contains: function(items, item) {
    // For arrays and strings
    if(items.indexOf) {
      return items.indexOf(item) != -1;
    // For objects
    } else {
      return _.each(items, function(value, key) {
        if(value === item) {
          return key;
        }
      });
    }
   },

   // Remove <item> from the given array
   remove: function(items, item) {
    var i = items.indexOf(item);
    if(i != -1) return items.splice(i, 1);
   },

  // Merge two arrays
  union: function(items1, items2) {
    var out = [];
    _.each(items1, function(item) {
      out.push(item);
    });
    _.each(items2, function(item) {
      out.push(item);
    });
    return out;
  },

  // Shallow copy the given array
  clone: function(items) {
    return _.union(items, []);
  },

  // Return the given object's keys
  keys: function(obj) {
    return Object.keys(obj);
  },

  // Return the given object's values as an array
  values: function(obj) {
    var out = [];
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        out.push(obj[key]);
      }
    }
    return out;
  },

  // Remove duplicates from the given list
  unique: function(items) {
    var out = [];
    _.each(items, function(item) {
      if(!_.contains(out, item)) {
        out.push(item);
      }
    });
    return out;
  },

  // Return new object with the fields from both given objects
  merge: function(obj1, obj2) {
    var obj = {};
    _.each(obj1, function(value, key) {
      obj[key] = value;
    });
    _.each(obj2, function(value, key) {
      obj[key] = value;
    });
    return obj;
  },

  // Return a copy without the null and undefined elements
  compact: function(items) {
    return _.select(items, function(item) {
      return item != null && item != undefined;
    });
  },

  // Return elements exclusive to only one of the arrays
  difference: function(array1, array2) {
    return _.union(_.select(array1, function(value) {
      return !_.contains(array2, value);
    }), _.select(array2, function(value) {
      return !_.contains(array1, value);
    }));
  },

  // Recursively merge two data structures
  deepMerge: function(obj1, obj2) {
    return _.merge(obj1, obj2);
  },

  // Convert the given string's first character to uppercase
  capitalize: function(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  },

  // Execute function at a later time
  defer: function(cb, millis) {
    return setTimeout(cb, millis || 0);
  },

  // Return a wrapper function that calls <cb>,
  // but at most every <thresh> milliseconds
  throttle: function(thresh, cb) {
    thresh = thresh || 1000;
    var lastT;
    var handle;
    var trailingArguments;
    return function() {
      var t = new Date().getMilliseconds();
      if(!lastT) {
        cb.apply(null, arguments);
        lastT = t;
      } else {
        if(!handle) {
          var delta = t - lastT;
          var sleep = Math.max(0, thresh - delta);
          handle = _.defer(function() {
            cb.apply(null, trailingArguments);
            lastT = t;
            handle = null;
          }, sleep);
        }
        trailingArguments = arguments;
      }
    };
  },

  // Convenience function for binding event handlers
  // Returns the given handler
  on: function(element, eName, handler) {
    element.addEventListener(eName, handler, false);
    return handler;
  },

  // Convenience function for removing event handlers
  off: function(element, eName, handler) {
    element.removeEventListener(eName, handler, false);
  },

  // Return a Promises/A+ compliant promise object
  promise: function(cb) {
    return new rsvp.Promise(cb);
  },

  // Wrap a value with a promise
  promiseFrom: function(value) {
    return _.promise(function(ok) {
      _.defer(function() {
        ok(value);
      });
    });
  },

  // Resolve all values in <items>, which need not all be promises
  resolvePromises: function(items) {
    var wrapped = _.map(items, function(item) {
      return _.promiseFrom(item);
    });
    if(Array.isArray(items)) {
      return rsvp.all(wrapped);
    } else {
      return rsvp.hash(wrapped);
    }
  },

  // Execute callback as soon as the DOM is complete
  documentReady: function(cb) {
    if(document.readyState == 'loading') {
      document.addEventListener('DOMContentLoaded', cb);
    } else {
      _.defer(cb);
    }
  },

  // JSON data over XMLHttpRequest as a promise
  ajax: function(verb, url, data) {
    return new rsvp.Promise(function(ok, fail) {
      var req = new XMLHttpRequest();
      req.timeout = 1000 * 20;
      req.open(verb, url);
      req.setRequestHeader('Content-Type', 'application/json')
      req.setRequestHeader('Accept', 'application/json');
      req.responseType = 'json';
      req.onload = function() {
        if(req.status == 200) {
          ok(req.response);
        } else {
          fail(Error(req.statusText));
        }
      };
      req.onerror = function() {
        fail(Error("Network Error"));
      };
      req.ontimeout = function() {
        fail(Error("Timeout"));
      };
      req.send(JSON.stringify(data));
    });
  },

  // Delegate DOM event handling to a parent object
  delegate: function(parent, eName, tagName, cb) {
    var handler = function(e) {
      if(e.target.tagName.toLowerCase() == tagName.toLowerCase()) {
        return cb(e);
      }
    };
    parent.addEventListener(eName, handler);
    return handler;
  },

  // Return all matches of the given regex
  scan: function(str, re) {
    var matches = [];
    var m;
    while(m = re.exec(str)) {
      matches.push(m);
    }
    return matches;
  },

  // Multiply <n> by itself
  square: function(n) {
    return n * n;
  },

  // Return a universally unique id
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
};
