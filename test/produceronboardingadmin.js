var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("ProducerOnBoardingAdmin", function () {
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

    importTest('./produceronboardingadmin/TC1');
    importTest('./produceronboardingadmin/TC2');
    importTest('./produceronboardingadmin/TC3');
    importTest('./produceronboardingadmin/TC4');

});