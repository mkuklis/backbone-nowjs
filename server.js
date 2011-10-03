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
var patients = new Backbone.Backend();
var Procedures = Backbone.Backend.extend({
  byPatientId: function (model, options, callback) {
    var results = [];
    for (var i = 0, l = this.col.length; i < l; i++) {
      if (this.col[i].patientId == options.id) {
        results.push(this.col[i]);
      }
    }
    callback(results);
  }
});

var procedures = new Procedures();
procedures.create({id:1, type:"outpatient", patientId: 1});
procedures.create({id:2, type:"outpatient", patientId: 1});

Backbone.nowjsConnector.connect(everyone, {patients: patients, procedures:procedures});
