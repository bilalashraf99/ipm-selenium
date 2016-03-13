var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("EnterDataAndReviewDocs (2)", function() {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Click on EnterDataAndReviewDocs
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('067600492')
        .elementByCss('input#search').click()
        .waitForElementByLinkText('EnterDataAndReviewDocs', 10000).click()

        // Fill in Contact Information form data
        .frame('TaskShowFrame')
        .waitForElementById('contactInformationHeader').click()
        .elementById('Street1Ds1').type('s1')
        .elementById('CityDs1').type('cityone')
        .elementByCss('#StateDs1 option[value=CA]').click()
        .elementById('ZipDs1').type('1111')
        .elementById('PhoneDs1').type('2222')
        .elementById('EmailDs1').type('solnsengg@gmail.com')

        // Fill in Errors and Omissions form data
        .elementById('errorsAndOmissionsHeader').click()
        .elementById('CarrierDs').type('111')
        .elementById('PolicyNumberDs').type('222')
        .elementById('ClaimLimitDs').type('333')
        .elementById('PolicyLimitDs').type('444')
        .elementById('CertificateNumberDs').type('555')

        // Should fill in Payment Accounts form data
        .elementById('paymentAccountsHeader').click()
        .elementById('AccountHolderNameDs1').type('John')
        .elementById('BankNameDs1').type('bank1')
        .elementById('BankRoutingNumberDs1').type('111')
        .elementById('AccountNumberDs1').type('222')
        .elementById('date_Time3_id-inputEl').type("Jan 01, 2015 00:00")
        .elementById('date_Time5_id-inputEl').type("Jan 01, 2300 00:00")

        // Fill in Legal Questions form data
        .elementById('legalQuestionsHeader').click()
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=No]').then(common.clickAll)

        // Fill in Appointment Requests form data
        .elementById('appointmentRequestsHeader').click()
        .elementByXPath('//div[@id="licensesBODsDiv"]//td[contains(text(), "New Hampshire - Non-Resident Producer")]/following::input[1]').click()

        // Fill in Upload Documents form data
        .elementById('uploadDocumentsHeader').click()
        .elementsByCss('#RequiredDocNamesTableDiv tr td:nth-child(2) input[type=radio]').then(common.clickAll)
        .elementsByCss('#RequiredDocNamesTableDiv tr td:nth-child(5) input[type=radio]').then(common.clickAll)

        // Click Collapse All and reopen Upload Documents section
        .elementByLinkText('Collapse All').click()
        .elementById('uploadDocumentsHeader').click()
        .elementById('headerLeftAndNavigationSummary').text().should.become("8 of 8 steps complete")

        // Click on Submit button
        .elementByCss('input[value=Submit]').click()
        .sleep(10000)

        // Validate Up-line screen
        .frame('TaskShowFrame')
        .waitForElementByCss('div#midPanelHeader').text().should.become('Select Up-line');

});
