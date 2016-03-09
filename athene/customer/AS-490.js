var wd = require('wd');
var common = require("../../test/common.js");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

describe("AS-490: Document Review - Reject Reason List incorrect", function () {
    this.timeout(60000);
    var config = common.config;
    before(function () {
        return browser
            .init(config.get("environment"))
            .setWindowSize(1200, 1000);
    });

    after(function () {
        return browser.quit();
    });

	it("VALIDATION", function () {
        return browser
			.get(url)
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()			
			.waitForElementByLinkText('OnBoarding', 80000).click()
			.waitForElementByCss('iframe', 5000)
			.frame('AppShowFrame')
			.sleep(5000)
			.waitForElementById('TaxIdDs', 80000).type('326588332')
			.elementById('EmailDs').clear().type('solnsengg@gmail.com')
			.elementById('FirstNameDsStart').clear().type('Fred')
			.elementById('LastNameDsStart').clear().type('Sellers')
			.elementById('dobDS_id-inputEl').clear().type('Jan 01, 1970')
			.elementById('date_Time1_id-inputEl').clear().type('Jan 01, 2016')
			.elementById('createButton').click()
			.waitForElementByLinkText('OnBoarding', 80000).click()
			.sleep(5000)
			.waitForElementByLinkText('OnBoarding', 80000)
			.waitForElementByCss('select#searchField option[value=TAX_ID]', 1000).click()
			.elementByCss('input#searchText').type('326588332')
			.elementByCss('input#search').click()
			.sleep(10000)
			.waitForElementByLinkText('EnterDataAndReviewDocs',10000).click()
			.waitForElementByCss('iframe', 10000)
			.frame('TaskShowFrame')
			.waitForElementByLinkText('Review Documents',10000).click()
			.sleep(8000)
			.waitForElementsByCss('div[id=RequiredDocNamesTableDiv] table tbody tr td select', 1000).text().should.eventually.contain("Select One", "Application - Address", "Application - Name", "Application - Social Security Number", "Application - Legal Questions", "Application – Consumer Report Authorization Signature and Date", "Application – Independent Producer Signature and Date", "Application – Electronic Signature Page", "Application – E&O", "Independent Producer Contract all 5 pages with Name and Signature", "Transmittal – Commission Level", "Transmittal – Full name of Agent/Agency", "Transmittal – Next in Hierarchy name/Agent number", "Release – Agent Name", "Release – Date", "Release- Top of Hierarchy Signature", "Assignment of Commissions – Agent Name", "Assignment of Commissions – Agent Signature and Date", "Assignment of Commissions – Business Entity Address", "Assignment of Commissions – Business Entity Authorized Signature and Date", "Assignment of Commissions – Business Entity Name", "Assignment of Commissions – Business Entity Title", "Assignment of Commissions – Tax Identification Number", "W9 – Not Received", "ACH – Not Received", "ACH – Section 1", "ACH – Section 2", "ACH – Section 3", "ACH – Section 4", "ACH – Voided Check", "Broker Dealer Forms");
	})
});