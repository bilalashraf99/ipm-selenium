var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Create instance (2)", function () {

    return browser
    // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        .initiatePersonOnboarding('067600492', 'solnsengg@gmail.com', 'John', 'Blumberg', 'LLIC', true, false)

        // Wait
        .sleep(8000)

        .verifyNewCase('067600492', 'John Blumberg')

        // Log out
        .elementByLinkText('Logout').click();

});
