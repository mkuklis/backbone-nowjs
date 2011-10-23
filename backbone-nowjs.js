(function() {
  var B;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    B = require('backbone');
  }
  if (typeof Backbone !== "undefined" && Backbone !== null) {
    B = Backbone;
  }
  B.Model = (function() {
    __extends(Model, B.Model);
    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }
    Model.prototype.getBackend = function() {
      return this.backend || this.collection.backend;
    };
    return Model;
  })();
  B.Collection = (function() {
    __extends(Collection, B.Collection);
    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }
    Collection.prototype.initialize = function() {
      return this.listen();
    };
    Collection.prototype.getBackend = function() {
      return this.backend;
    };
    Collection.prototype.listen = function() {
      return now[this.backend] = {
        update: __bind(function(model, options) {
          if (this.notify[options.notify](now.core.clientId, options)) {
            if (model != null) {
              return this.get(model.id).set(model, options);
            }
          }
        }, this),
        create: __bind(function(model, options) {
          if (this.notify[options.notify](now.core.clientId, options)) {
            if (model != null) {
              return this.add(model, options);
            }
          }
        }, this),
        "delete": __bind(function(model, options) {
          if (this.notify[options.notify](now.core.clientId, options)) {
            if (model != null) {
              return this.remove(model, options);
            }
          }
        }, this),
        read: __bind(function(data, options, success) {}, this)
      };
    };
    Collection.prototype.notify = {
      all: function() {
        return true;
      },
      none: function() {
        return false;
      },
      self: function(clientId, options) {
        return clientId === (options != null ? options.clientId : void 0);
      },
      others: function(clientId, options) {
        return clientId !== (options != null ? options.clientId : void 0);
      }
    };
    return Collection;
  })();
  B.sync = function(method, model, options) {
    var backend, success;
    backend = this.getBackend();
    if (backend == null) {
      throw "no backend found for given model";
    }
    success = options.success;
    delete options.success;
    delete options.error;
    if (options.notify == null) {
      options.notify = "all";
    }
    options.clientId = now.core.clientId;
    try {
      return now.serverSync(method, backend, model.attributes, options, success);
    } catch (e) {
      return model.trigger('error', model, e, options);
    }
  };
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    B.connector = {
      connect: function(nowjs, everyone, backends) {
        everyone.on('join', function() {
          var group;
          return group = B.connector.getGroup(nowjs).addUser(this.user.clientId);
        });
        return everyone.now.serverSync = function(method, backend, model, options, success) {
          var action, group;
          action = options.action != null ? options.action : method;
          group = B.connector.getGroup(nowjs);
          try {
            return backends[backend][action](model, options, __bind(function(data) {
              if (method === "read") {
                return success(data, options);
              } else {
                return group.now[backend][method](data, options);
              }
            }, this));
          } catch (e) {

          }
        };
      },
      getGroup: function(now) {
        return now.getGroup("default");
      }
    };
    B.Backend = (function() {
      function Backend() {
        this.col = [];
      }
      Backend.prototype.update = function(data, options, callback) {
        var el, i, _len, _ref;
        _ref = this.col;
        for (i = 0, _len = _ref.length; i < _len; i++) {
          el = _ref[i];
          if (data.id === el.id) {
            this.col[i] = data;
            if (typeof callback === "function") {
              callback(this.col[i]);
            }
            return this.col[i];
          }
        }
      };
      Backend.prototype.create = function(data, options, callback) {
        data.id = Math.floor(Math.random() * 10000);
        this.col.push(data);
        return typeof callback === "function" ? callback(data) : void 0;
      };
      Backend.prototype.read = function(data, options, callback) {
        var item;
        if ((data != null ? data.id : void 0) != null) {
          item = _(this.col).detect(function(item) {
            return item.id === data.id;
          });
          return typeof callback === "function" ? callback(item) : void 0;
        } else {
          return typeof callback === "function" ? callback(this.col) : void 0;
        }
      };
      Backend.prototype["delete"] = function(data, options, callback) {
        var el, i, _len, _ref;
        _ref = this.col;
        for (i = 0, _len = _ref.length; i < _len; i++) {
          el = _ref[i];
          if (data.id === el.id) {
            this.col.splice(i, 1);
            if (typeof callback === "function") {
              callback(data);
            }
            return data;
          }
        }
      };
      return Backend;
    })();
    B.Backend.extend = B.Model.extend;
    module.exports = B;
  }
}).call(this);
