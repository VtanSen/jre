/*!
 * JSRT JavaScript Library 0.2.1
 * lico.atom@gmail.com
 *
 * Copyright 2008, 2014 Atom Union, Inc.
 * Released under the MIT license
 *
 * Date: 2014年7月7日
 */

define(function(require, exports, module) {

  require("bootstrap!js.awt.Component");

  return Class.forName({
    name: "class js.awt.Menu extends js.awt.Component",
    "public Menu": function() {

    }
  }).getClassConstructor();
});