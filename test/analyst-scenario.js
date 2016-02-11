var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("Analyst Scenario", function () {
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
            .quit();
    });

    importTest('./analyst-scenario/TC1');
    importTest('./analyst-scenario/TC3');
    importTest('./analyst-scenario/TC4');
    importTest('./analyst-scenario/TC8');
    importTest('./analyst-scenario/TC9');

});
