lively.require("lively.lang.Runtime").toRun(function() {

  lively.lang.Runtime.Registry.addProject({
    name: "koyo",
    rootDir: "/home/lively/LivelyKernel/users/robertkrahn/koyo",

    reloadAll: function(project, thenDo) {
      // var project = lively.lang.Runtime.Registry.default().projects["koyo"];
      // project.reloadAll(project, function(err) { err ? show(err.stack || String(err)) : alertOK("reloaded!"); })
      var files = ["core.js", "alternatives.js"];
      lively.lang.Runtime.loadFiles(project, files, thenDo);
    },

    resources: {

      // React to changes of the lib files. Note that a change of base.js needs to
      // be handled differently b/c it can redefine the entire lively.lang object.
      // Changes of other files require us to update "our" lively.lang object but
      // also to re-install the globalized version of the interface methods to
      // String,Array,...

      "core.js": {
        matches: /(core|alternatives)\.js$/,
        changeHandler: function(change, project, resource) {
  				var state = project.state || (project.state = {});
          lively.lang.Runtime.evalCode(project, change.newSource, state, change.resourceId);
  				if (state.koyo) Global.koyo = state.koyo;
  				if (state["koyo-alt"]) Global["koyo-alt"] = state["koyo-alt"];
        }
      },

      "tests": {
        matches: /tests\/.*.js$/,
        changeHandler: function(change, project, resource) {
          
          lively.lang.fun.composeAsync(
            function(next) {
              lively.require("lively.MochaTests").toRun(function() { next(); });
            },
            function(next) {
              JSLoader.forcedReload("http://cdnjs.cloudflare.com/ajax/libs/expect.js/0.2.0/expect.min.js");
              lively.lang.fun.waitFor(3000, function() { return typeof expect !== "undefined" && expect !== chai.expect; }, next);
            },
            function(next) {
              Object.extend(project.state, {
                mocha: Global.mocha,
                expect: Global.expect,
                lively: lively,
                koyo: Global.koyo,
              });
              lively.lang.Runtime.evalCode(project, change.newSource, project.state, change.resourceId, next);
            }
          )(function(err) {
            if (err) show(String(err));
            else alertOK("defining tests for " + change.resourceId);
          });
        },
      }

    }
  });

});
