var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Initiate New Onboarding process", function() {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'ebms'
        .login('ebms')

        // Navigate to User Management under Administration tab and click Add button
        .waitForElementByLinkText('Administration', 10000).click()
        .waitForElementByLinkText('User Management', 10000).click()
        .elementByCss('span.x-btn-button span.bmAdd').click()

        // Fill form with user data and submit
        .frame('createPanelIframe')
        .elementByCss('input[name=userName]').type('371494996')
        .elementByCss('input[name=password]').type('password')
        .elementByCss('input[name=confPassword]').type('password')
        .elementByCss('input[name=firstName]').type('National Benefits Group Llc')
        .elementByCss('input[name=lastName]').type('Dba Greenway Financial')
        .elementByCss('input[name=email]').type('solnsengg@gmail.com')
        .elementByCss('input[name=createUser]').click()

        // Log out
        .frame()
        .elementByLinkText('Logout').click()

        // Log in as user 'AnalystUser1'
        .login('analyst')

        .initiateOrganizationOnboarding('371494996', 'solnsengg@gmail.com', 'National Benefits Group Llc Dba Greenway Financial', 'IFS Bank', false, true)

        // WAIT
        .sleep(8000)

        .verifyNewCase('371494996', 'National Benefits Group Llc Dba Greenway Financial')

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
