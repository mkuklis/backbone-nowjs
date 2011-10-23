B = require('backbone') if module?.exports?
B = Backbone if Backbone?

class B.Model extends B.Model
  getBackend: ->
    @.backend or @.collection.backend

class B.Collection extends B.Collection
  initialize: ->
    @listen()

  getBackend: ->
    @.backend

  listen: ->
    # nowjs callbacks
    now[@.backend] =
      update: (model, options) =>
        if @.notify[options.notify](now.core.clientId, options)
          @.get(model.id).set(model, options) if model?
      create: (model, options) =>
        if @.notify[options.notify](now.core.clientId, options)
          @.add(model, options) if model?
      delete: (model, options) =>
        if @.notify[options.notify](now.core.clientId, options)
          @.remove(model, options) if model?
      read: (data, options, success) =>
        #@[if options?.add then 'add' else 'reset'](data, options);
 
  notify:
    all: ->
      true
    none: ->
      false
    self: (clientId, options) ->
      clientId is options?.clientId
    others: (clientId, options) ->
      clientId isnt options?.clientId

B.sync = (method, model, options) ->

  backend = @.getBackend()
  throw "no backend found for given model" unless backend?

  success = options.success
  # nowjs currently doesn't seem to handle complex 
  # structures so removing callbacks for now
  delete options.success
  delete options.error

  options.notify = "all" unless options.notify?
  options.clientId = now.core.clientId

  try
    now.serverSync method, backend, model.attributes, options, success
  catch e
    model.trigger('error', model, e, options)

# server side
if module?.exports?
  B.connector =
    connect: (nowjs, everyone, backends) ->
      everyone.on 'join', () ->
        group = B.connector.getGroup(nowjs).addUser(this.user.clientId)

      # register server side callback
      everyone.now.serverSync = (method, backend, model, options, success) ->
        action = if options.action? then options.action else method

        # retrieve current group
        group = B.connector.getGroup(nowjs)
        try
          backends[backend][action] model, options, (data) =>
            if method == "read" # call current client
              success(data, options)
            else # call everyone
              group.now[backend][method](data, options)
        catch e

    # creates and returns default group
    # override it for your needs
    getGroup: (now) ->
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
