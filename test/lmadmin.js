var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("LMAdmin", function () {
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

    importTest('./lmadmin/TC1');
    importTest('./lmadmin/TC2');
    importTest('./lmadmin/TC3');
    importTest('./lmadmin/TC4');
    importTest('./lmadmin/TC7');
    importTest('./lmadmin/TC10');
    importTest('./lmadmin/TC13');

});
