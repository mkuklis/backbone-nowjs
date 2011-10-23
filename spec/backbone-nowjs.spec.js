var Backbone = require('backbone-nowjs');
var http = require('http');

(function() {
  beforeEach(function () {
    this.server = http.createServer();
    this.server.listen(1337, "127.0.0.1");
  });

  afterEach(function () {
    this.server.close();
  });

  describe("backbone-nowjs", function () {
    it("should read from backend", function() {
    });
  });
})();
