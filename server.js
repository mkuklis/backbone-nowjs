var sys = require("sys")
  , uuid = require("node-uuid")
  , express = require('express')
  , nowjs = require("now")
  , port = parseInt(process.env.VCAP_APP_PORT || process.env.PORT || 8080)
  // settings
  , Settings = require('settings')
  , config = __dirname + '/config/config.js'
  , settings = new Settings(config).getEnvironment(process.env.NODE_ENV || "dev");

// express
var app = express.createServer();
app.register('.html', require('ejs'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.render('index.html');
});

app.listen(port);
var everyone = nowjs.initialize(app);

var collection = [];
var crud = {
  update: function (model) {
    collection.forEach(function (item, index) {
      if (item.id === model.id) {
        collection[index] == model;
        return true;
      }
    });
    return model;
  },
  create: function (model) {
    model.id = uuid();
    collection.push(model);
    return model;
  },
  delete: function (model) {
    collection.forEach(function (item, index) {
      if (item.id === model.id) {
        collection.splice(index, 1);
        return true;
      }
    });
    return model
  },
  read: function () {
    return collection;
  }
};

everyone.now.sync = function (method, name, model, options) {
  var data = crud[method](model, options);
  if (method === "read") {
    this.now[name][method](data, options);
  }
  else {
    console.log(name)
    console.log(method)
    everyone.now[name][method](data, options);
  }
}
