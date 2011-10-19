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
  B.connector = {
    extractName: function(model, options) {
      var l, name, s;
      name = _.isFunction(model.url) ? model.url() : model.url;
      s = name.split("/");
      l = s.length;
      if (l > 1) {
        return name = l % 2 ? s[l - 2] : s[l - 1];
      } else {
        return name = s[0];
      }
    },
    notify: {
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
    }
  };
  B.Collection = (function() {
    __extends(Collection, B.Collection);
    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }
    Collection.prototype.initialize = function() {
      return this.listen();
    };
    Collection.prototype.listen = function() {
      var name;
      name = B.connector.extractName(this);
      return now[name] = {
        update: __bind(function(model, options) {
          if (B.connector.notify[options.notify](now.core.clientId, options)) {
            if (model != null) {
              return this.get(model.id).set(model, options);
            }
          }
        }, this),
        create: __bind(function(model, options) {
          if (B.connector.notify[options.notify](now.core.clientId, options)) {
            if (model != null) {
              return this.add(model, options);
            }
          }
        }, this),
        "delete": __bind(function(model, options) {
          if (B.connector.notify[options.notify](now.core.clientId, options)) {
            if (model != null) {
              return this.remove(model, options);
            }
          }
        }, this),
        read: __bind(function(data, options, success) {}, this)
      };
    };
    return Collection;
  })();
  B.sync = function(method, model, options) {
    var name, success;
    name = Backbone.connector.extractName(this);
    success = options.success;
    delete options.success;
    delete options.error;
    if (options.notify == null) {
      options.notify = "all";
    }
    options.clientId = now.core.clientId;
    try {
      return now.serverSync(method, name, model.attributes, options, success);
    } catch (e) {
      return model.trigger('error', model, e, options);
    }
  };
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    B.connector.connect = function(nowjs, everyone, backends) {
      everyone.on('join', function() {
        return B.connector.getGroup(nowjs).addUser(this.user.clientId);
      });
      return everyone.now.serverSync = function(method, name, model, options, success) {
        var action, group;
        action = options.action != null ? options.action : method;
        group = B.connector.getGroup(nowjs);
        try {
          return backends[name][action](model, options, __bind(function(data) {
            if (method === "read") {
              return success(data, options);
            } else {
              return group.now[name][method](data, options);
            }
          }, this));
        } catch (e) {

        }
      };
    };
    B.connector.getGroup = function(now) {
      return now.getGroup("default");
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
