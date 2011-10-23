var zombie = require('zombie');
var assert = require("assert");

var sys = require("sys")
  , path = require('path')
  , express = require('express')
  , nowjs = require("now")
  , port = 8181
  , Backbone = require('backbone-nowjs');

// express to make life easier
var app = express.createServer();
var basePath = path.normalize(__dirname + "/..");

app.register('.html', require('ejs'));

app.set('views', basePath + '/demo/todos/views');

app.set('view engine', 'html');
app.set('view options', {layout: false});
app.use(express.static(basePath + '/demo/todos/node_modules/backbone-nowjs/'));
app.use(express.static(basePath + '/demo/todos'));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.listen(port);

var everyone = nowjs.initialize(app);
var todos = new Backbone.Backend();

Backbone.connector.connect(nowjs, everyone, {todos: todos});

zombie.visit("http://localhost:8181/", function (err, browser, status) {
  browser.
    fill("new-todo", "new todo");
  //function(err, browser, status) {
  //console.log(browser.dump());
      // Form submitted, new page loaded.
      //assert.equal(browser.text("title"), "Welcome To Brains Depot");
  //  })

});


