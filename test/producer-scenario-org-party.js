var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("Producer scenario, Org party", function () {
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

    importTest('./producer-scenario-org-party/TC1');
    importTest('./producer-scenario-org-party/TC2');
    importTest('./producer-scenario-org-party/TC16');

});
