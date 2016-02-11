require("date-utils");
var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("EnterDataAndReviewDocs - Enter data - Person", function() {

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

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Search for EnterDataAndReviewDocs task
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('067600492')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath("//*[@id='SearchResults']//a[normalize-space(text())='EnterDataAndReviewDocs']").click()

        // Fill in Contact Information form data
        .frame('TaskShowFrame')
        .elementById('contactInformationHeader').click()
        .elementById('Street1Ds1').type("s1")
        .elementById('CityDs1').type("cityone")
        .elementByCss('select#StateDs1 option[value=CA]').click()
        .elementById('ZipDs1').type("1111")
        .elementById('PhoneDs1').type("2222")
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
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=No]').then(clickAll)

        // Fill in Appointment Requests form data
        .elementById('appointmentRequestsHeader').click()
        //.elementByXPath('//div[@id="appointmentRequestsContentDiv"]//td[contains(text(), "Oregon")]/following-sibling::td//input').click()
        .elementByXPath('//div[@id="appointmentRequestsContentDiv"]//td[contains(text(), "Michigan")]/following-sibling::td//input').click()

        // Verify 7 of 8 steps complete
        .elementByLinkText('Collapse All').click()
        .elementById('headerLeftAndNavigationSummary').text().should.become("7 of 8 steps complete");

});
