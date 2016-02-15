var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("Reject NIPR appointments", function () {
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

    importTest('./reject-nipr-appointments/TC1');
    importTest('./reject-nipr-appointments/TC2');
    importTest('./reject-nipr-appointments/TC3');
    importTest('./reject-nipr-appointments/TC9');
    importTest('./reject-nipr-appointments/TC10');

});