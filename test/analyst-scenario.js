var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("Analyst Scenario", function () {
    this.timeout(300000);

    var config = common.config;

    before(function () {
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
    importTest('./analyst-scenario/TC10');
    importTest('./analyst-scenario/TC11');
    importTest('./analyst-scenario/TC12');
    importTest('./analyst-scenario/TC13');

});
