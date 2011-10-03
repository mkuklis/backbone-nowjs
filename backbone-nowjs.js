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
  B.nowjsConnector = {
    extractName: function(model, options) {
      var l, name, s;
      name = _.isFunction(model.url) ? model.url() : model.url;
      s = name.split("/");
      l = s.length;
      return name = l % 2 ? s[l - 2] : s[l - 1];
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
      name = B.nowjsConnector.extractName(this);
      return now[name] = {
        update: __bind(function(model, options) {
          if (model != null) {
            return this.get(model.id).set(model, options);
          }
        }, this),
        create: __bind(function(model, options) {
          if (model != null) {
            return this.add(model, options);
          }
        }, this),
        "delete": __bind(function(model, options) {
          if (model != null) {
            return this.remove(model, options);
          }
        }, this),
        read: __bind(function(data, options, success) {}, this)
      };
    };
    return Collection;
  })();
  B.sync = function(method, model, options) {
    var name, success;
    name = Backbone.nowjsConnector.extractName(this);
    success = options.success;
    delete options.success;
    delete options.error;
    return now.serverSync(method, name, model.attributes, options, success);
  };
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    B.nowjsConnector.connect = function(everyone, backends) {
      return everyone.now.serverSync = function(method, name, model, options, success) {
        var action;
        action = options.action != null ? options.action : method;
        return backends[name][action](model, options, __bind(function(data) {
          if (method === "read") {
            return success(data, options);
          } else {
            return everyone.now[name][method](data, options);
          }
        }, this));
      };
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
