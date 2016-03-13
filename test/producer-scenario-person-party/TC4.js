var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

it("Initiate New Onboarding process", function () {
  
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
        .elementByCss('input[name=userName]').type('067600492')
        .elementByCss('input[name=password]').type('password')
        .elementByCss('input[name=confPassword]').type('password')
        .elementByCss('input[name=firstName]').type('John')
        .elementByCss('input[name=lastName]').type('Blumberg')
        .elementByCss('input[name=email]').type('solnsengg@gmail.com')
        .elementByCss('input[name=createUser]').click()

        // Log out
        .frame()
        .elementByLinkText('Logout').click()

        // Log in as user 'AnalystUser1'
        .login('analyst')

        .initiatePersonOnboarding('067600492', 'solnsengg@gmail.com', 'John', 'Blumberg', 'IFS Bank', false, true)

        // Wait
        .sleep(8000)

        .verifyNewCase('067600492', 'John Blumberg')

        // Log out
        .frame()
        .elementByLinkText('Logout').click()

        // Load DCM login page
        .get(dcmUrl)

        // Log in as user 'sa'
        .elementByCss('form[name=LoginForm] input[name=LOGINNAME]').type(config.get("sa.username"))
        .elementByCss('form[name=LoginForm] input[name=PASSWORD]').type(config.get("sa.password"))
        .elementByCss('form[name=LoginForm] input[type=SUBMIT]').click()

        // Navigate to Party -> Party
        .frame("navbar")
        .waitForElementByCss('a#Party').click()

        // Perform search on Tax ID
        .frame()
        .frame("container")
        .frame("cacheframe0")
        .frame("subpage")
        .waitForElementByCss('input[name=Field_Person_Main_TaxID_Search_Value]').type('067600492')
        .elementByLinkText('Search').click()
        .waitForElementByCss('table[name=Grid_Person_Main] tbody td:nth-child(2)').text().should.become('Blumberg')
        .elementByCss('table[name=Grid_Person_Main] tbody td:nth-child(5)').text().should.become('067600492')
        .elementByCss('table[name=Grid_Person_Main] tbody td:nth-child(12)').text().should.become('solnsengg@gmail.com')

        // Log out
        .frame()
        .frame("navbar")
        .elementByLinkText('Logout').click();

});
