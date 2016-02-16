require("date-utils");
var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Verify modifications for organization party", function () {

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

        // Log in as user '020258767'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("020258767.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("020258767.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Attempt to enter valid value
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('8767')
        .elementByCss('form[name=form] input[type=submit]').click()
        .waitForElementByCss('form[name=form]').text().should.eventually.include("Welcome to Aurea's Agent OnBoarding Process")

        // Verify Contact Information
        .elementById('contactInformationHeader').click()
        .elementByCss('select#ContactTypeDs1').text().should.eventually.include("CTName1")

        // Fill in Errors and Omissions form data
        .elementById('errorsAndOmissionsHeader').click()
        .elementById('CarrierDs').type('CarrierOne')
        .elementById('PolicyNumberDs').type('1111')
        .elementById('ClaimLimitDs').type('2222')
        .elementById('PolicyLimitDs').type('3333')
        .elementById('CertificateNumberDs').type('certificate123')

        // Should fill in Payment Accounts form data and verify
        .elementById('paymentAccountsHeader').click()
        .elementByCss('#AccountTypeDs1 option[value=DefaultPayment]').click()
        .elementByCss('#PaymentTypeDs1 option[value=W2]').click()
        .elementById('AccountHolderNameDs1').type('Willis')
        .elementById('BankNameDs1').type('Bank1')
        .elementById('BankRoutingNumberDs1').type('1111')
        .elementById('AccountNumberDs1').type('2222')
        .elementById('date_Time3_id-inputEl').type(Date.today().toFormat(format))
        .elementByCss('#AccountTypeDs1').text().should.eventually.include("PAName")
        .elementByCss('#PaymentTypeDs1').text().should.eventually.include("BalName1")

        // Verify Continuing Education form data
        .elementById('continuingEducationHeader').click()
        .elementById('continuingEducationContentDiv').text().should.eventually.include("AML Training for Organization")
        .and.should.eventually.include("Model Law Training for Organization")
        .and.should.eventually.include("IA Index Training")

        // Fill in Legal Questions form data and verify
        .elementById('legalQuestionsHeader').click()
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=No]').then(clickAll)
        .elementsByCss('div#legalQuestionsContentDiv').text().should.eventually.include("Legal Question 1")

        // Fill in Appointment Requests form data
        .elementById('appointmentRequestsHeader').click()
        .elementByCss('#appointmentRequestsContentDiv input[type=checkbox]:not(:checked)').then(clickAll)

        // Click on Submit button
        .elementByLinkText('Collapse All').click()
        .elementByCss('input[value=Submit]').click()
        .sleep(5000);

});
