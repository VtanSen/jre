/*
 * ! JSRT JavaScript Library 0.1.5 lico.atom@gmail.com
 *
 * Copyright 2008, 2014 Atom Union, Inc. Released under the MIT license
 *
 * Date: Feb 15, 2014
 */
define(function(require, exports, module) {
  require("bootstrap!js.test.annotation.After");
  require("bootstrap!js.test.annotation.AfterClass");
  require("bootstrap!js.test.annotation.Before");
  require("bootstrap!js.test.annotation.BeforeClass");
  require("bootstrap!js.test.annotation.Ignore");
  require("bootstrap!js.test.annotation.Test");

  /** 
   * @class js.test.TestCase
   * @extends {js.lang.Object}
   * @description 
   * <p>&nbsp;&nbsp;&nbsp;&nbsp;
   * </p><br/>
   *
   * @author lico
   * @version 0.1.1
   * @since 0.0.1
   */
  return Class.forName( /** @lends js.test.TestCase.prototype */ {
    name: "class js.test.TestCase extends Object",
    "@Setter @Getter private _testMethods": [],
    "@Setter @Getter private _ignoreTestMethods": [],
    "@Setter @Getter private _configMethods": [],

    TestCase: function() {},
    initial: function() {

      var msg = ["########  TestCase { ClassName「", this.getClass().getName(), "」 }  ########"];

      js.lang.System.out.group(msg.join(""));

      this.reset();
      this.injectMethods();
      this.invokeBeforeClass();
      this.execute();
      this.invokeAfterClass();

      js.lang.System.out.groupEnd();
    },
    reset: function() {
      var methods = this.getTestMethods();
      if (methods) {
        methods.clear();
      }

      var ignoreMethods = this.getIgnoreTestMethods();
      if (ignoreMethods) {
        ignoreMethods.clear();
      }

      var configMethods = this.getConfigMethods();
      if (configMethods) {
        configMethods.clear();
      }
    },
    invokeBeforeClass: function() {

      var beforeClass = this.getConfigMethods()[0];

      if (beforeClass) {
        beforeClass.getValue().call(this.getClass().getClassConstructor());
      }

    },
    invokeAfterClass: function() {

      var afterClass = this.getConfigMethods()[3];

      if (afterClass) {
        afterClass.getValue().call(this.getClass().getClassConstructor());
      }
    },
    injectMethods: function() {
      var methods = this.$class.getDeclaredMethods();
      Object.each(methods, function(j, v, o) {

        var annotations = v.getDeclaredAnnotations(),
          annotation = null;
        for (var i = 0, len = annotations.length; i < len; i++) {
          annotation = annotations[i];
          if (annotation.$class === js.test.annotation.BeforeClass.$class &&
            (v.getModifiers() & 8) !== 0) {
            this.getConfigMethods()[0] = v;
          } else if (annotation.$class === js.test.annotation.AfterClass.$class &&
            (v.getModifiers() & 8) !== 0) {
            this.getConfigMethods()[3] = v;
          } else if (annotation.$class === js.test.annotation.After.$class) {
            this.getConfigMethods()[2] = v;
          } else if (annotation.$class === js.test.annotation.Before.$class) {
            this.getConfigMethods()[1] = v;
          } else {
            if (annotation.$class === js.test.annotation.Ignore.$class) {
              this.getIgnoreTestMethods().push(v);
            } else if (annotation.$class === js.test.annotation.Test.$class) {
              this.getTestMethods().push(v);
            }
          }

          /*
          if (v.getName().indexOf("test") === 0) {
            this.getTestMethods().push(v());
          }
          */
        }
      }, this);
    },

    execute: function() {
      var j = 0,
        len = this.getTestMethods().length;

      for (; j < len; j++) {

        var m = this.getTestMethods()[j];

        var method = m.getValue();

        var msg = ["        --------  Method「", m.getName(), "」  "];


        js.lang.System.out.println(msg.join(""));

        try {
          var before = this.getConfigMethods()[1];
          if (before) {
            before.getValue().call(this);
          }

          method.call(this);

          var after = this.getConfigMethods()[2];
          if (after) {
            after.getValue().call(this);
          }

          js.lang.System.out.println("        结果： √ ");
        } catch (e) {
          js.lang.System.out.error("        结果： ×     详细描述：  %s", ["Name< ", e.getName(), " >;  Number< ", e.getNumber(), " >;  Message< ", e.getMessage(), " >"].join(""));
        }
        // if (!obj[name]) {
        // js.lang.System.out.warn("%s",
        // "this test unit case is not be promoted !");
        // }
        js.lang.System.out.println("");
      }

    }
  }).getClassConstructor();

});