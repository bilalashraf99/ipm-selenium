require("date-utils");
var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("EnterDataAndReviewDocs - Enter data - Person", function() {

    var format = 'MMM DD, YYYY 00:00';

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Search for EnterDataAndReviewDocs task
        .waitForElementByCss('select#searchField option[value=TAX_ID]', 5000).click()
        .elementByCss('input#searchText').type('067600492')
        .elementByCss('input#search').click()
        //.elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath("//*[@id='SearchResults']//a[normalize-space(text())='EnterDataAndReviewDocs']", 5000).click()

        // Fill in Contact Information form data
        .frame('TaskShowFrame')
        .elementById('contactInformationHeader').click()
        .elementById('Street1Ds1').clear().type("s1")
        .elementById('CityDs1').clear().type("cityone")
        .elementByCss('select#StateDs1 option[value=CA]').click()
        .elementById('ZipDs1').clear().type("1111")
        .elementById('PhoneDs1').clear().type("2222")
        .elementById('EmailDs1').clear().type("solnsengg@gmail.com")

        // Fill in Errors and Omissions form data
        .elementById('errorsAndOmissionsHeader').click()
        .elementByCss('select#PolicyTypeDs option[value=Bond]').click()
        .elementById('CarrierDs').type('111')
        .elementById('PolicyNumberDs').type('222')
        .elementById('ClaimLimitDs').type('333')
        .elementById('PolicyLimitDs').type('444')
        .elementById('CertificateNumberDs').type('555')

        // Fill in Payment Accounts form data
        .elementById('paymentAccountsHeader').click()
        .elementByCss('select#AccountTypeDs1 option[value=Escrow]').click()
        .elementByCss('select#PaymentTypeDs1 option[value="1099"]').click()
        .elementById('AccountHolderNameDs1').type('John')
        .elementById('BankNameDs1').type('bank1')
        .elementById('BankRoutingNumberDs1').type('111')
        .elementById('AccountNumberDs1').type('222')
        .elementById('date_Time3_id-inputEl').type(new Date(2015, 1, 1).toFormat(format))
        .elementById('date_Time5_id-inputEl').type(new Date(2300, 1, 1).toFormat(format))

        // Fill in Legal Questions form data
        .elementById('legalQuestionsHeader').click()
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=No]').then(common.clickAll)

        // Fill in Appointment Requests form data
        .elementById('appointmentRequestsHeader').click()
        .elementByXPath('//div[@id="appointmentRequestsContentDiv"]//td[contains(text(), "Oregon")]/following-sibling::td//input').click()
        //.elementByXPath('//div[@id="appointmentRequestsContentDiv"]//td[contains(text(), "Michigan")]/following-sibling::td//input').click()

        // Verify 7 of 8 steps complete
        .elementByLinkText('Collapse All').click()
        .sleep(1000)
        .elementById('headerLeftAndNavigationSummary').text().should.become("7 of 8 steps complete");

});
