var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Create instance (2)", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        .initiatePersonOnboarding('067600492', 'solnsengg@gmail.com', 'John', 'Blumberg', 'LLIC', true, false)

        // Wait
        .sleep(8000)

        .verifyNewCase('067600492', 'John Blumberg')

        // Log out
        .elementByLinkText('Logout').click();

});
