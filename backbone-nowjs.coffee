Backbone.nowjsConnector =
  extractName: (model) ->
    name = if _.isFunction(model.url) then model.url() else model.url
    s = name.split("/") 
    l = s.length
    name = if l % 2 then s[l - 2] else s[l - 1]

class Backbone.Collection extends Backbone.Collection
  initialize: ->
    @listen()
  listen: ->
    name = Backbone.nowjsConnector.extractName(@)
    # nowjs callbacks
    now[name] = {
      update: (model, options) =>
        this.get(model.id).set(model, options)
      create: (model, options) =>
        this.add(model, options)
      delete: (model, options) =>
        this.remove(model, options)
      read: (data, options) =>
        this[if options?.add then 'add' else 'reset'](data, options);
    }

Backbone.sync = (method, model, options) ->
  name = Backbone.nowjsConnector.extractName(@)
  delete options.success
  delete options.error
  now.sync method, name, model.attributes, options
