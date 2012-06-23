var util = require('util')
  , express = require('express')
  , nowjs = require("now")
  , port = parseInt(process.env.VCAP_APP_PORT || process.env.PORT || 8080)
  , Backbone = require('backbone-nowjs');

// express to make life easier
var app = express.createServer();
app.register('.html', require('ejs'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('view options', {layout: false});

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/node_modules/backbone-nowjs/'));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.listen(port);

var everyone = nowjs.initialize(app);
var todos = new Backbone.Backend();

Backbone.connector.connect(nowjs, everyone, {todos: todos});
