var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("DCM status flow (Person) and populateDocsToSDMS", function () {
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

    importTest('./dcm-status-flow-and-populatedocstosdms/TC1');

});
