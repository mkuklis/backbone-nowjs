B = require('backbone') if module?.exports?
B = Backbone if Backbone?

B.nowjsConnector =
  # url comes in different flavors
  # /patients - all patients
  # /patients/1 - patient with id 1
  # /patients/1/procedures - all procedures for patient with id 1
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
        @.get(model.id).set(model, options)
      create: (model, options) =>
        @.add(model, options)
      delete: (model, options) =>
        @.remove(model, options)
      read: (data, options) =>
        @[if options?.add then 'add' else 'reset'](data, options);

B.sync = (method, model, options) ->
  name = Backbone.nowjsConnector.extractName(@)
  delete options.success
  delete options.error
  now.serverSync method, name, model.attributes, options

# server side
if module?.exports?
  uuid = require('backbone');

  B.nowjsConnector.connect = (everyone, backends) ->
    # register server side server callback
    everyone.now.serverSync = (method, name, model, options) ->
      action = if options.action? then options.action else method
      backends[name][action] model, options, (data) =>
        if method == "read" # call current client
          this.now[name][method](data, options)
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
          callback(@.col[i])
          return @.col[i]
    create: (data, options, callback) ->
      data.id = Math.floor(Math.random() * 10000);
      @.col.push(data)
      callback(data)
    read: (data, options, callback) ->
      if data?.id?
        item = _(@.col).detect (item) -> item.id == data.id
        callback(item)
      else
        callback(@.col)
    delete: (data, options, callback) ->
      for el, i in @.col
        if data.id == el.id
          @.col.splice(i, 1);
          callback(@.col[i])
          return @.col[i]

  module.exports = B
