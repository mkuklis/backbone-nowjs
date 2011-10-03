var sys = require("sys")
  , uuid = require("node-uuid")
  , express = require('express')
  , nowjs = require("now")
  , port = parseInt(process.env.VCAP_APP_PORT || process.env.PORT || 8080)
  , _ = require('underscore')._
  // settings
  , Settings = require('settings')
  , config = __dirname + '/config/config.js'
  , settings = new Settings(config).getEnvironment(process.env.NODE_ENV || "dev")
  , Backbone = require('backbone');

require('./backbone-nowjs');

// express
var app = express.createServer();
app.register('.html', require('ejs'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + '/'));
app.get('/', function(req, res) {
  res.render('index.html');
});

app.listen(port);
var everyone = nowjs.initialize(app);
var cars = new Backbone.Backend
Backbone.nowjsConnector.connect(everyone, {cars: cars});
