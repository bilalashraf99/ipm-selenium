var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Validate fields in Initiate New Onboarding", function () {

    // Load login page
    var step1 = browser
        .get(url);

    // Log in as user 'AnalystUser1'
    var step2 = step1
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();

    // Click OnBoarding link in My Widgets section
    var step3 = step2
        .waitForElementByLinkText('OnBoarding', 10000).click();

    // Submit an empty form"
    var step4 = step3
        .frame('AppShowFrame')
        .waitForElementByCss('#combobox1 option[value=Organization]').click()
        .elementById('createButton', 15000).click()
        .elementByXPath("//*[@id='TaxIdDs_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='EmailDs_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='OrganizationNameDsStart_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='combobox6_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('* required');

    // Fill form with invalid data and submit
    var step5 = step4
        .elementById('TaxIdDs').type('123456789')
        .elementById('EmailDs').type('abc@gmail.com')
        .elementById('OrganizationNameDsStart').type('TestOrg')
        .elementByCss('#combobox6 option[value="IFS Bank"]').click()
        .elementById('createButton').click();

    // Dismiss the popup message
    var step6 = step5
        .waitForElementByLinkText('OK', 10000).click();

    // Try to enter too long Tax ID
    var step7 = step6
        .elementById('TaxIdDs').type('1234567890')
        .getValue().should.become('123456789');

    // Should log out
    return step7
        .frame()
        .elementByLinkText('Logout').click();

});
