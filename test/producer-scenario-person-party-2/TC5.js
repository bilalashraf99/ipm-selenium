require("date-utils");
var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Initiate new OnBoarding instance", function () {

    var format = 'MMM DD, YYYY 00:00';

    var clickAll = function(elements) {
        var result = [];
        for (var i = 0; i < elements.length; i++) {
            result.push(elements[i].click());
        }
        return Promise.all(result);
    };

    return browser
        // Load login page
        .get(url)

        // Log in as user 'ebms'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("ebms.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("ebms.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

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
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click OnBoarding link in My Widgets section
        .waitForElementByLinkText('OnBoarding', 10000).click()

        // Fill form with user data and submit
        .frame('AppShowFrame')
        .elementById('TaxIdDs').type('067600492')
        .elementById('EmailDs').type('solnsengg@gmail')
        .elementById('FirstNameDsStart').type('John')
        .elementById('LastNameDsStart').type('Blumberg')
        .elementByCss('#combobox6 option[value="IFS Bank"]').click()
        .elementById('createButton').click()
        .sleep(2000)
        .waitForElementByCss('.x-message-box .x-header-text').text().should.eventually.not.contain('error')

        // Log out
        .frame()
        .elementByLinkText('Logout').click()

        // Log in as user '067600492'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("067600492.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("067600492.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Attempt to enter valid value
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('0492')
        .elementByCss('form[name=form] input[type=submit]').click()

        // Expand all sections
        .frame('TaskShowFrame')
        .elementByLinkText('Expand All').click()

        // Fill in Errors and Omissions form data
        .elementById('CarrierDs').type('Carrier1')
        .elementById('PolicyNumberDs').type('1111')
        .elementById('ClaimLimitDs').type('2222')
        .elementById('PolicyLimitDs').type('3333')
        .elementById('CertificateNumberDs').type('certificate123')

        // Fill in Payment Accounts form data
        .elementById('AccountHolderNameDs1').type('Blumberg')
        .elementById('BankNameDs1').type('Bank1')
        .elementById('BankRoutingNumberDs1').type('1111')
        .elementById('AccountNumberDs1').type('2222')
        .elementById('date_Time3_id-inputEl').type(Date.today().toFormat(format))
        .elementById('date_Time5_id-inputEl').type(Date.tomorrow().toFormat(format))

        // Fill in Legal Questions form data
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=Yes]').then(clickAll)

        // Fill in Appointment Requests form data
        .elementByXPath('//div[@id="licensesBODsDiv"]//td[contains(text(), "Michigan")]/following::input[1]').click()

        // Collapse all sections
        .elementByLinkText('Collapse All').click()
        .elementByCss('#headerLeftAndNavigationSummary').text().should.eventually.include("7 of 7 steps")

        // Click Submit
        .elementByCss('input[value=Submit]').click()

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
