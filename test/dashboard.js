var common = require("./common");
var browser = common.browser;

function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

describe("Dashboard", function () {
  this.timeout(30000);
  
  var config = common.config;
  
  before(function () {
    // optional extra logging
//    browser.on('status', function(info) {
//      console.log(info);
//    });
//    browser.on('command', function(meth, path, data) {
//      console.log(' > ' + meth, path, data || '');
//    });

    return browser
      .init(config.get("environment"));
  });
  
  after(function () {
    return browser
//      .frame()
//      .elementByLinkText('Logout').click()
      .quit();
  });
  
  importTest("My Tasks widget - Basic search", './dashboard/TC12');
  importTest("My Tasks widget - Advanced search", './dashboard/TC13');
  importTest("My Widgets - Basic search", './dashboard/TC14');
  importTest("My Widgets - Advanced search", './dashboard/TC15');
  importTest("View / Edit Documents", './dashboard/TC7');
  importTest("View / Edit Notes", './dashboard/TC8');

});
