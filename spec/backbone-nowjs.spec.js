var Backbone = require('backbone-nowjs')
  , http = require('http')
  , nowjs = require("now")
  , nowclient = require('nowclient');

(function() {
  beforeEach(function () {
    this.server = http.createServer();
    this.server.listen(1337, "127.0.0.1");
    this.everyone = nowjs.initialize(this.server);
    this.list = new Backbone.Backend();
    Backbone.connector.connect(nowjs, this.everyone, {list: this.list});
  });

  afterEach(function () {
    this.server.close();
  });

  describe("backbone-nowjs", function () {
    it("should read from backend", function() {

    });
  });
})();
