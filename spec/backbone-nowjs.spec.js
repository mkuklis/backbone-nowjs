var http = require('http')
  , nowjs = require("now")
  , nowclient = require('nowclient');
now = nowclient.now;
Backbone = require('backbone-nowjs');

var Backend = Backbone.Backend.extend({
  initialize: function () {
    this.col = [{id:1, name: "test1"}, {id: 2, name: "test2"}];
  }
});

var list = new Backend();

var Item = Backbone.Model.extend({
  collection: Items
});

var Items = Backbone.Collection.extend({
  backend: "list",
  model: Item
});


(function() {

  beforeEach(function () {
    this.server = http.createServer();
    this.server.listen(8282, "127.0.0.1");
    this.everyone = nowjs.initialize(this.server);

    Backbone.connector.connect(nowjs, this.everyone, {list: list});
  });

  afterEach(function () {
    this.server.close();
  });

  describe("backbone-nowjs", function () {
    it("should read from backend", function() {
      nowclient.connect('127.0.0.1:8282')
      waits(2000);
      var self = this;
      now.ready(function () {
        var items = new Items();

        items.bind('reset', function (data) {
          expect(data.size()).toBe(2);
        });

        items.fetch();
      });
    });
  });
})();
