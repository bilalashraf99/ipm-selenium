require("date-utils");
var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Initiate new OnBoarding instance and Enter Data", function () {

    var format = 'MMM DD, YYYY 00:00';

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
        .elementByCss('input[name=userName]').type('326588332')
        .elementByCss('input[name=password]').type('password')
        .elementByCss('input[name=confPassword]').type('password')
        .elementByCss('input[name=firstName]').type('Fred')
        .elementByCss('input[name=lastName]').type('Sellers')
        .elementByCss('input[name=email]').type('solnsengg@gmail.com')
        .elementByCss('input[name=createUser]').click()

        // Log out
        .frame()
        .elementByLinkText('Logout').click()

        // Log in as user 'AnalystUser1'
        .login('analyst')

        .initiatePersonOnboarding('326588332', 'solnsengg@gmail.com', 'Fred', 'Sellers', 'IFS Bank', false, true)

        // Wait
        .sleep(8000)

        .verifyNewCase('326588332', 'Fred Sellers')

        // Log out
        .frame()
        .elementByLinkText('Logout').click()

        // Log in as user '326588332'
        .login('326588332')

        // Attempt to enter valid value
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('8332')
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
        .elementById('AccountHolderNameDs1').type('Fred Sellers')
        .elementById('BankNameDs1').type('Bank1')
        .elementById('BankRoutingNumberDs1').type('1111')
        .elementById('AccountNumberDs1').type('2222')
        .elementById('date_Time3_id-inputEl').type(Date.today().toFormat(format))
        .elementById('date_Time5_id-inputEl').type(Date.tomorrow().toFormat(format))

        // Fill in Legal Questions form data
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=Yes]').then(common.clickAll)

        // Fill in Appointment Requests form data
        .elementByXPath('//div[@id="licensesBODsDiv"]//td[contains(text(), "Michigan")]/following::input[1]').click()

        // Collapse all sections
        .elementByLinkText('Collapse All').click()
        .elementByCss('#headerLeftAndNavigationSummary').text().should.eventually.include("7 of 7 steps")
        .frame();

});
