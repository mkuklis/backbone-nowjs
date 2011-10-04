B = require('backbone') if module?.exports?
B = Backbone if Backbone?

B.nowjsConnector =
  extractName: (model, options) ->
    name = if _.isFunction(model.url) then model.url() else model.url
    s = name.split("/")
    l = s.length
    name = if l % 2 then s[l - 2] else s[l - 1]

class B.Collection extends B.Collection
  initialize: ->
    @listen()
  listen: ->
    name = B.nowjsConnector.extractName(@)
    # nowjs callbacks
    now[name] =
      update: (model, options) =>
        if now.core.clientId isnt options?.clientId
          delete options.clientId if options?.clientId
          options.silent = false if options?.skip
          @.get(model.id).set(model, options) if model?
      create: (model, options) =>
        @.add(model, options) if model?
      delete: (model, options) =>
        @.remove(model, options) if model?
      read: (data, options, success) =>
        #@[if options?.add then 'add' else 'reset'](data, options);

B.sync = (method, model, options) ->
  name = Backbone.nowjsConnector.extractName(@)
  success = options.success
  # nowjs currently doesn't seem to handle complex 
  # structures so removing callbacks for now
  delete options.success
  delete options.error

  # include clientId if skip is present
  if options.skip?
    options.clientId = now.core.clientId
    options.silent = true
  now.serverSync method, name, model.attributes, options, success

# server side
if module?.exports?
  B.nowjsConnector.connect = (everyone, backends) ->
    # register server side callback
    everyone.now.serverSync = (method, name, model, options, success) ->
      action = if options.action? then options.action else method
      backends[name][action] model, options, (data) =>
        if method == "read" # call current client
          # this.now[name][method](data, options)
          success(data, options)
        else # call everyone
          everyone.now[name][method](data, options)

  # Backbone Backend
  # This is a basic naive in-memory implementation
  # Please override it to support your needs
  class B.Backend
    constructor: ->
      @.col = []
    update: (data, options, callback) ->
      for el, i in @.col
        if data.id == el.id
          @.col[i] = data
          callback?(@.col[i])
          return @.col[i]
    create: (data, options, callback) ->
      data.id = Math.floor(Math.random() * 10000);
      @.col.push(data)
      callback?(data)
    read: (data, options, callback) ->
      if data?.id?
        item = _(@.col).detect (item) -> item.id == data.id
        callback?(item)
      else
        callback?(@.col)
    delete: (data, options, callback) ->
      for el, i in @.col
        if data.id == el.id
          @.col.splice(i, 1);
          callback?(data)
          return data

  B.Backend.extend = B.Model.extend
  module.exports = B

