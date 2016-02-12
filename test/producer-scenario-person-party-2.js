var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("Producer Scenario, Person Party - Session 2", function () {
    this.timeout(60000);

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

    importTest('./producer-scenario-person-party-2/TC1');
    importTest('./producer-scenario-person-party-2/TC2');
    importTest('./producer-scenario-person-party-2/TC3');
    importTest('./producer-scenario-person-party-2/TC4');
    importTest('./producer-scenario-person-party-2/TC5');
    importTest('./producer-scenario-person-party-2/TC12');

});
