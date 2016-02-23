var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("Producer scenario, Org party", function () {
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

    importTest('./producer-scenario-org-party/TC1');
    importTest('./producer-scenario-org-party/TC2');
    importTest('./producer-scenario-org-party/TC3');
    importTest('./producer-scenario-org-party/TC4');
    importTest('./producer-scenario-org-party/TC5');
    importTest('./producer-scenario-org-party/TC6');
    importTest('./producer-scenario-org-party/TC7');
    importTest('./producer-scenario-org-party/TC8');
    importTest('./producer-scenario-org-party/TC9');
    importTest('./producer-scenario-org-party/TC10');
    importTest('./producer-scenario-org-party/TC14');
    importTest('./producer-scenario-org-party/TC15');
    importTest('./producer-scenario-org-party/TC16');

});
