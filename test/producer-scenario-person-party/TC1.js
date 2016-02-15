var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Validate fields in Initiate New Onboarding - Producer", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click OnBoarding link in My Widgets section
        .waitForElementByLinkText('OnBoarding', 10000).click()

        // Submit an empty form
        .frame('AppShowFrame')
        .waitForElementById('createButton', 15000).click()
        .elementByXPath("//*[@id='TaxIdDs_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='EmailDs_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='FirstNameDsStart_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='LastNameDsStart_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='combobox6_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('* required')

        // Fill form with invalid data and submit
        .elementById('TaxIdDs').type('123456789')
        .elementById('EmailDs').type('abc@gmail.com')
        .elementById('FirstNameDsStart').type('Thomas')
        .elementById('LastNameDsStart').type('Feola')
        .elementByCss('#combobox6 option[value="IFS Bank"]').click()
        .elementById('createButton').click()

        // Dismiss the popup message
        .waitForElementByLinkText('OK', 10000).click()

        // Try to enter too long Tax ID
        .elementById('TaxIdDs').type('1234567890')
        .getValue().should.become('123456789')

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
