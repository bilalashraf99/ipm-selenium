var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("Producer scenario, Person party", function () {
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

    importTest('./producer-scenario-person-party/TC1');
    importTest('./producer-scenario-person-party/TC2');
    importTest('./producer-scenario-person-party/TC3');
    importTest('./producer-scenario-person-party/TC4');
    importTest('./producer-scenario-person-party/TC5');
    importTest('./producer-scenario-person-party/TC6');
    importTest('./producer-scenario-person-party/TC7');
    importTest('./producer-scenario-person-party/TC8');
    importTest('./producer-scenario-person-party/TC9');
    importTest('./producer-scenario-person-party/TC10');
    importTest('./producer-scenario-person-party/TC11');
    importTest('./producer-scenario-person-party/TC12');
    importTest('./producer-scenario-person-party/TC13');
    importTest('./producer-scenario-person-party/TC14');

});
