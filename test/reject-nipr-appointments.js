var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("Reject NIPR appointments", function () {
    this.timeout(120000);

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

    importTest('./reject-nipr-appointments/TC1');
    importTest('./reject-nipr-appointments/TC2');
    importTest('./reject-nipr-appointments/TC3');
    importTest('./reject-nipr-appointments/TC4');
    // TODO: TC8 won't work without the steps in between!
    importTest('./reject-nipr-appointments/TC8');
    importTest('./reject-nipr-appointments/TC9');
    importTest('./reject-nipr-appointments/TC10');
    importTest('./reject-nipr-appointments/TC11');
    importTest('./reject-nipr-appointments/TC12');
    // TODO: TC15 won't work without the steps in between!
    importTest('./reject-nipr-appointments/TC15');

});
