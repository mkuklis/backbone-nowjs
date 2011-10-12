backbone-nowjs
================

This is a [Backbone.js](http://documentcloud.github.com/backbone/) connector for [nowjs](http://nowjs.com/). 
The connector overrides Backbone's default sync functionality to allow for seemless integration with server-side based 
on [node](http://nodejs.org/) and nowjs.


Demos
-----
* [Real time todo list](https://github.com/mkuklis/backbone-nowjs/tree/master/demo/todos) real time todo list based on oryginal work by Jérôme Gravel-Niquet (run `npm install` in order to bundle all dependecies)


Dependencies
------------
* [nowjs](https://github.com/flotype/now) (>= 0.7.4)
* [Backbone.js](https://github.com/documentcloud/backbone) (>= 0.5.3)
* [Underscore.js](https://github.com/documentcloud/underscore) (>= 1.1.7)


Installation
------------
On server install backbone-nowjs via npm first:

        npm install backbone-nowjs

and then include it in your project:

        var BackboneNJS = require('backbone-nowjs');

In browser include single JavaScript file:

       <script src="backbone-nowjs.js"></script>
