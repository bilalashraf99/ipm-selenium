var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("Dashboard", function () {
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

    importTest('./dashboard/TC6');
    importTest('./dashboard/TC7');
    importTest('./dashboard/TC8');
    importTest('./dashboard/TC10');
    importTest('./dashboard/TC12');
    importTest('./dashboard/TC13');
    importTest('./dashboard/TC14');
    importTest('./dashboard/TC15');

    importTest('./dashboard/TC9');

});
