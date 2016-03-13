var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Initiate OB process - Person party", function() {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        .initiatePersonOnboarding('067600492', 'solnsengg@gmail.com', 'John', 'Blumberg', 'LLIC', false, false)

        // Wait
        .sleep(8000)

        .verifyNewCase('067600492', 'John Blumberg')

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
