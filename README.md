backbone-nowjs
================

This is a [Backbone.js](http://documentcloud.github.com/backbone/) connector for [nowjs](http://nowjs.com/). 
The connector overrides Backbone's default sync functionality to allow for seemless integration with server-side based 
on [node](http://nodejs.org/) and nowjs.


Demos
-----
* [Real time todo list](https://github.com/mkuklis/backbone-nowjs/tree/master/demo/todos) based on original work by Jérôme Gravel-Niquet (run `npm install` in order to bundle all dependecies)


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

Features
--------

Coming soon I promise :) for now check todo list demo.

License
-------

<pre>
(The MIT License)

Copyright (c) 2011 Michal Kuklis

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
</pre>

