var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Create OB instance for organization party", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'ebms'
        .login('ebms')

        // Click on Administration tab
        .waitForElementByLinkText('Administration', 10000).click()

        // Click on User Management
        .waitForElementByLinkText('User Management', 10000).click()

        // Click on Add button on the right hand side
        .elementByCss('span.x-btn-button span.bmAdd').click()

        // Fill form with user data and submit
        .frame('createPanelIframe')
        .elementByCss('input[name=userName]').type('020258767')
        .elementByCss('input[name=password]').type('password')
        .elementByCss('input[name=confPassword]').type('password')
        .elementByCss('input[name=firstName]').type('Willis of New Hampshire')
        .elementByCss('input[name=lastName]').type('Inc')
        .elementByCss('input[name=email]').type('solnsengg@gmail.com')
        .elementByCss('input[name=createUser]').click()

        // Log out
        .frame()
        .elementByLinkText('Logout').click()

        // Log in as user 'AnalystUser1'
        .login('analyst')

        .initiateOrganizationOnboarding('020258767', 'solnsengg@gmail.com', 'Willis Of New Hampshire Inc', 'IFS Bank', false, true)

        // Wait
        .sleep(8000)

        .verifyNewCase('020258767', 'Willis Of New Hampshire Inc')

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
