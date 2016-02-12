var common = require("./common");
var browser = common.browser;

function importTest(path) {
    require(path);
}

describe("BCResultsReview and ReviewApptResponseFromNIPR", function () {
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

    importTest('./bcresultsreview-and-reviewapptresponsefromnipr/TC1');
    importTest('./bcresultsreview-and-reviewapptresponsefromnipr/TC2');
    importTest('./bcresultsreview-and-reviewapptresponsefromnipr/TC3');
    importTest('./bcresultsreview-and-reviewapptresponsefromnipr/TC7');
    importTest('./bcresultsreview-and-reviewapptresponsefromnipr/TC8');
    importTest('./bcresultsreview-and-reviewapptresponsefromnipr/TC9');

});
