var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Validate fields in Initiate New Onboarding - Organization", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Click OnBoarding link in My Widgets section
        .waitForElementByLinkText('OnBoarding', 10000).click()

        // Select Organization in Party type dropdown
        .frame('AppShowFrame')
        .elementById('combobox1').type('organization')

        // Submit an empty form
        .waitForElementById('createButton', 15000).click()
        .elementByXPath("//*[@id='TaxIdDs_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='EmailDs_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='OrganizationNameDsStart_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='combobox6_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('* required')

        // Fill form with invalid data and submit
        .elementById('TaxIdDs').type('123456789')
        .elementById('EmailDs').type('abc@gmail.com')
        .elementById('OrganizationNameDsStart').type('TestOrg')
        .elementByCss('#combobox6 option[value="IFS Bank"]').click()
        .elementById('createButton').click()

        // Dismiss the popup message
        .waitForElementByLinkText('OK', 120000).click()

        // Try to enter too long Tax ID
        .elementById('TaxIdDs').type('1234567890')
        .getValue().should.become('123456789')

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
