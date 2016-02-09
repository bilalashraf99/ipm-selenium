var common = require("./common");
var browser = common.browser;

function importTest(path) {
  require(path);
}

describe("Dashboard", function () {
  this.timeout(60000);

  var config = common.config;
  
  before(function () {
    // optional extra logging
    browser.on('status', function(info) {
      console.log(info);
    });
    browser.on('command', function(meth, path, data) {
      console.log(' > ' + meth, path, data || '');
    });

    return browser
      .init(config.get("environment"))
      .setWindowSize(1200, 1000);
  });
  
  after(function () {
    return browser
      //.frame()
      //.elementByLinkText('Logout').click()
      .quit();
  });
  
  //importTest("My Tasks widget - Basic search", './dashboard/TC12');
  //importTest("My Tasks widget - Advanced search", './dashboard/TC13');
  //importTest("My Widgets - Basic search", './dashboard/TC14');
  //importTest("My Widgets - Advanced search", './dashboard/TC15');
  //importTest('./dashboard/TC7');
  //importTest("View / Edit Notes", './dashboard/TC8');
  //importTest("Reassign Case", './dashboard/TC9');
  //importTest("Send Email", './dashboard/TC10');
  importTest('./dashboard/TC6');

});
