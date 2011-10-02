(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Backbone.nowjsConnector = {
    extractName: function(model) {
      var l, name, s;
      name = _.isFunction(model.url) ? model.url() : model.url;
      s = name.split("/");
      l = s.length;
      return name = l % 2 ? s[l - 2] : s[l - 1];
    }
  };
  Backbone.Collection = (function() {
    __extends(Collection, Backbone.Collection);
    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }
    Collection.prototype.initialize = function() {
      return this.listen();
    };
    Collection.prototype.listen = function() {
      var name;
      name = Backbone.nowjsConnector.extractName(this);
      return now[name] = {
        update: __bind(function(model, options) {
          return this.get(model.id).set(model, options);
        }, this),
        create: __bind(function(model, options) {
          return this.add(model, options);
        }, this),
        "delete": __bind(function(model, options) {
          return this.remove(model, options);
        }, this),
        read: __bind(function(data, options) {
          return this[(options != null ? options.add : void 0) ? 'add' : 'reset'](data, options);
        }, this)
      };
    };
    return Collection;
  })();
  Backbone.sync = function(method, model, options) {
    var name;
    name = Backbone.nowjsConnector.extractName(this);
    delete options.success;
    delete options.error;
    return now.sync(method, name, model.attributes, options);
  };
}).call(this);
