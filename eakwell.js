"use strict";

var rsvp = require('rsvp');

rsvp.on('error', function(e) {
  console.error(e);
  throw e;
});

var _ = module.exports = {

  // Empty placeholder function
  noop: function() {},

  // Loop through objects and arrays
  // Return something truthy from callback to stop iteration
  each: function(items, cb) {
    if(Array.isArray(items)) {
      for(var i = 0; i < items.length; i++) {
        var cancel = cb(items[i], i);
        if(cancel) return cancel;
      }
    } else {
      var i = 0;
      for(var key in items) {
        if(items.hasOwnProperty(key)) {
          var cancel = cb(items[key], key, i++);
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
      var value = cb(i);
      if(value) return value;
    }
  },

  // Ramp a value up from <from> to <to> in <steps> steps
  step: function(from, to, steps, cb) {
    return _.times(steps, function(step) {
      return cb(from + (to - from) * step / steps);
    });
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
      if(cb) return cb(item1, item2);
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
    var ary = Array.isArray(items);
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

  // Separate the items for which the condition holds
  // from those for which it does not
  partition: function(items, cb) {
    var ary = Array.isArray(items);
    var out1 = ary ? [] : {};
    var out2 = ary ? [] : {};
    _.each(items, function(item, key) {
      if(cb(item, key)) {
        if(ary) {
          out1.push(item);
        } else {
          out1[key] = item;
        }
      } else {
        if(ary) {
          out2.push(item);
        } else {
          out2[key] = item;
        }
      }
    });
    return [out1, out2];
  },

  // Return the smallest item according to <cb>
  minBy: function(items, cbOrName) {
    var min;
    var minValue = Infinity;
    var callback = (typeof cbOrName === 'function');
    _.each(items, function(item, i) {
      var value = callback ? cbOrName(item, i) : item[cbOrName];
      if(value < minValue) {
        min = item;
        minValue = value;
      }
    });
    return min;
  },

  // Return the largest item according to <cb>
  maxBy: function(items, cbOrName) {
    var max;
    var maxValue = -Infinity;
    var callback = (typeof cbOrName === 'function');
    _.each(items, function(item, i) {
      var value = callback ? cbOrName(item, i) : item[cbOrName];
      if(value > maxValue) {
        max = item;
        maxValue = value;
      }
    });
    return max;
  },

  // Return the number of items that match the given condition
  count: function(items, cb) {
    var ary = Array.isArray(items);
    var matched = _.select(items, cb);
    return ary ? matched.length : _.keys(matched).length;
  },

  // Check if all items match the given condition
  all: function(items, cb) {
    var ary = Array.isArray(items);
    var length = ary ? items.length : _.keys(items).length
    return _.count(items, cb) == length;
  },

  // Check if any item matches the given condition
  any: function(items, cb) {
    return _.each(items, cb);
  },

  // Return the first element from <items> that matches the given condition
  find: function(items, cb) {
    return _.each(items, function(item, i) {
      if(cb(item, i)) return item;
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

  // Return elements exclusive to only one of the arrays
  difference: function(array1, array2) {
    return _.union(_.select(array1, function(value) {
      return !_.contains(array2, value);
    }), _.select(array2, function(value) {
      return !_.contains(array1, value);
    }));
  },

  // Return elements contained in both arrays
  intersection: function(array1, array2) {
    return _.select(array1, function(value) {
      return _.contains(array2, value);
    });
  },

  // Shallow copy the given array or object
  clone: function(items) {
    if(items != null && typeof(items) == 'object') {
      var ary = Array.isArray(items);
      return ary ? _.union(items, []) : _.merge(items, {});
    } else {
      return items;
    }
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

  size: function(items) {
    if(Array.isArray(items)) {
      return items.length;
    } else {
      return _.keys(items).length;
    }
  },

  average: function(values) {
    var avrg = 0;
    _.each(values, function(value) {
      avrg += value;
    });
    return avrg / values.length;
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

  // Mix methods into the given object
  does: function(obj, methods) {
    _.each(methods, function(method, name) {
      obj[name] = method;
    });
  },

  // Return a copy without the null and undefined elements
  compact: function(items) {
    return _.select(items, function(item) {
      return item != null && item != undefined;
    });
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

  // Defer as a promise
  delay: function(millis) {
    return new Promise(function(ok, fail) {
      _.defer(ok, millis);
    });
  },

  // Keep checking <condition> until it's met
  waitFor: function(condition, cb, interval) {
    interval = interval || 100;
    var iv = setInterval(function() {
      if(condition()) {
        cb();
        clearInterval(iv);
      }
    }, interval);
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

  // Return a wrapper function that calls <cb>,
  // but waits with the next call until its
  // asynchronous predecessor has returned
  autoThrottle: function(cb) {
    var running = false;
    var updateRequested = false;
    return function() {
      if(running) {
        updateRequested = true;
      } else {
        var ok = function() {
          running = false;
          if(updateRequested) {
            updateRequested = false;
            running = true;
            cb(ok);
          }
        };
        running = true;
        cb(ok);
      }
    };
  },

  // Convenience function for binding event handlers
  // Returns the given handler
  on: function(element, eName, handler) {
    var eNames = eName.split(' ');
    _.each(eNames, function(eName) {
      element.addEventListener(eName, handler, false);
    });
    return handler;
  },

  // Run the given handler at most once
  once: function(element, eName, handler) {
    var handle = _.on(element, eName, function() {
      handler();
      _.off(handle);
    });
    return handle;
  },

  // Convenience function for removing event handlers
  off: function(element, eName, handler) {
    var eNames = eName.split(' ');
    _.each(eNames, function(eName) {
      element.removeEventListener(eName, handler, false);
    });
  },

  // Return a Promises/A+ compliant promise object
  promise: function(cb) {
    return new rsvp.Promise(cb);
  },

  // Wrap a value with a promise
  promiseFrom: function(value) {
    return _.promise(function(ok) {
      // _.defer(function() {
        ok(value);
      // });
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
  ajax: function(options) {
    options = _.merge({
      verb: 'GET',
      url: '',
      responseType: 'json',
      data: null
    }, options);
    return new rsvp.Promise(function(ok, fail) {
      var req = new XMLHttpRequest();
      req.timeout = 1000 * 20;
      var url = options.url;
      if(options.verb == 'GET' && options.data) {
        url += '?data=' + encodeURIComponent(JSON.stringify(options.data));
      }
      req.open(options.verb, url);
      req.setRequestHeader('Content-Type', 'application/json')
      // req.setRequestHeader('Accept', 'application/json');
      req.responseType = options.responseType;
      req.onload = function() {
        if(('' + req.status)[0] == '2') {
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
      if(options.verb == 'POST') {
        req.send(JSON.stringify(options.data || {}));
      } else {
        req.send();
      }
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
  },

  hasValue: function(obj) {
    return obj != undefined && obj != null;
  },

  eventHandling: function(obj) {
    _.does(obj, {
      listeners: [],

      // Register a handler to be called every time an event happens
      on: function(actions, cb) {
        var self = this;
        actions = actions.split(' ');
        _.each(actions, function(action) {
          var l = {
            action: action,
            cb: cb
          };
          self.listeners.push(l);
          self.emit('listenerAdded', [action, cb]);
        });
        return cb;
      },

      // Remove a handler from all events it was registered for
      off: function(handler) {
        for (var i = this.listeners.length - 1; i >= 0; i--) {
          var l = this.listeners[i];
          if(l.cb === handler) {
            this.listeners.splice(i, 1);
            this.emit('listenerRemoved', [l.action, handler]);
          }
        }
        return this;
      },

      // Register a handler to be called as soon as an event happens
      once: function(actions, cb) {
        var self = this;
        var handler = function() {
          self.off(handler);
          cb();
        };
        return self.on(actions, handler);
      },

      // Call all handlers that listen to this event
      emit: function(action, data) {
        var self = this;
        var listeners = _.clone(self.listeners);
        for(var i in listeners) {
          var l = listeners[i];
          if(l.action == action) {
            l.cb.apply(self, data);
          }
        }
        return self;
      },

      // Re-emit events of another object
      proxy: function(obj, action) {
        var self = this;
        return obj.on(action, function() {
          self.emit(action, arguments);
        });
      },

      // Drop all listeners
      discardEventHandlers: function(silent) {
        var self = this;
        if(silent) {
          self.listeners = [];
        } else {
          var parts = _.partition(self.listeners, function(l) {
            return l.action == 'listenerRemoved';
          });
          // Remove regular event handlers first
          _.each(parts[1], function(l) {
            self.off(l.cb);
          });
          // Then remove the 'listenerRemoved' handlers themselves
          _.each(parts[0], function(l) {
            self.off(l.cb);
          });
        }
        return self;
      }
    });
  }
};
