B = require('backbone') if module?.exports?
B = Backbone if Backbone?

B.connector =
  extractName: (model, options) ->
    name = if _.isFunction(model.url) then model.url() else model.url
    s = name.split("/")
    l = s.length
    name = if l % 2 then s[l - 2] else s[l - 1]

  notify:
    all: ->
      true
    none: ->
      false
    self: (clientId, options) ->
      clientId is options?.clientId
    others: (clientId, options) ->
      clientId isnt options?.clientId

class B.Collection extends B.Collection
  initialize: ->
    @listen()
  listen: ->
    name = B.connector.extractName(@)
    # nowjs callbacks
    now[name] =
      update: (model, options) =>
        if B.connector.notify[options.notify](now.core.clientId, options)
          @.get(model.id).set(model, options) if model?
      create: (model, options) =>
        if B.connector.notify[options.notify](now.core.clientId, options)
          @.add(model, options) if model?
      delete: (model, options) =>
        if B.connector.notify[options.notify](now.core.clientId, options)
          @.remove(model, options) if model?
      read: (data, options, success) =>
        #@[if options?.add then 'add' else 'reset'](data, options);

B.sync = (method, model, options) ->
  name = Backbone.connector.extractName(@)
  success = options.success
  # nowjs currently doesn't seem to handle complex 
  # structures so removing callbacks for now
  delete options.success
  delete options.error

  options.notify = "all" unless options.notify?
  options.clientId = now.core.clientId
  
  try
    now.serverSync method, name, model.attributes, options, success
  catch e
    model.trigger('error', model, e, options)

# server side
if module?.exports?
  B.connector.connect = (nowjs, everyone, backends) ->

    everyone.on 'join', () ->
      B.connector.getGroup(nowjs).addUser(this.user.clientId)

    # register server side callback
    everyone.now.serverSync = (method, name, model, options, success) ->
      action = if options.action? then options.action else method
      # retrieve current group
      group = B.connector.getGroup(nowjs)

      try
        backends[name][action] model, options, (data) =>
          if method == "read" # call current client
            # this.now[name][method](data, options)
            success(data, options)
          else # call everyone
            group.now[name][method](data, options)
      catch e
  # creates and returns default group
  # override it for your needs
  B.connector.getGroup = (now) ->
    now.getGroup("default")

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
