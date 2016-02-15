require("date-utils");
var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("EnterDataAndReviewDocs - Person party", function() {

    var clickAll = function(elements) {
        var results = [];
        for (var i = 0; i < elements.length; i++) {
            results.push(elements[i].click());
        }
        return Promise.all(results);
    };

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1' {
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click on EnterDataAndReviewDocs
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('067600492')
        .elementByCss('input#search').click()
        .waitForElementByLinkText('EnterDataAndReviewDocs', 10000).click()

        // Expand all sections
        .frame('TaskShowFrame')
        .waitForElementByLinkText('Expand All').click()

        // Fill in Errors and Omissions form data
        .elementById('CarrierDs').type('Carrier1')
        .elementById('PolicyNumberDs').type('1111')
        .elementById('ClaimLimitDs').type('2222')
        .elementById('PolicyLimitDs').type('3333')
        .elementById('CertificateNumberDs').type('certificate123')

        // Fill in Payment Accounts form data
        .elementById('AccountHolderNameDs1').type('John Blumberg')
        .elementById('BankNameDs1').type('Bank1')
        .elementById('BankRoutingNumberDs1').type('1111')
        .elementById('AccountNumberDs1').type('2222')
        .elementById('date_Time3_id-inputEl').type(Date.today().toFormat(format))
        .elementById('date_Time5_id-inputEl').type(Date.tomorrow().toFormat(format))

        // Fill in Legal Questions form data
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=Yes]').then(clickAll)

        // Fill in Appointment Requests form data
        .elementByCss('#appointmentRequestsContentDiv input[type=checkbox]:not(:checked)').then(clickAll)

        // Click Collapse All, reopen and fill Upload Documents section
        .elementByLinkText('Collapse All').click()
        .elementById('uploadDocumentsHeader').click()
        .elementsByXPath('//div[@id="RequiredDocNamesTableDiv"]//input[@value="Yes" and not(contains(@id,"Rejected_yes"))]').then(clickAll)
        .elementsByXPath('//div[@id="RequiredDocNamesTableDiv"]//input[contains(@id,"_Rejected_No")]').then(clickAll)

        // Click Collapse All, reopen Upload Documents section and Submit
        .elementByLinkText('Collapse All').click()
        .elementById('uploadDocumentsHeader').click()
        .elementByCss('input[value=Submit]').click()
        .waitForElementByCss('div#midPanelHeader', 5000).text().should.become('Select Up-line');

});