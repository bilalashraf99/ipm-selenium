var wd = require('wd');
var common = require("../../test/common.js");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

describe("AS-1241: Reassign Task - Allows Null Selection", function () {
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
	
	it("Prerequisites: Create OB instance", function () {
        return browser
			//Pre-requisites - Create OnBoarding instance
			.get(url)
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()			
			// Initiate OnBoarding for - Fred Sellers
			.waitForElementByLinkText('OnBoarding', 80000).click()
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
			.waitForElementByLinkText('Logout',1000).click();
	})
	
	it("VALIDATION - Fred Sellers 326588332", function () {
        return browser
			//Validation
			//Login as Manager User
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type('ManagerUser1')
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type('ManagerUser1')
			.elementByCss('form[name=loginForm] input[type=submit]').click()
			//Search by Tax id
			.waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
			.elementByCss('select#case_OPERATOR option[value=IS]').click()
			.elementByCss('input#case_searchText').clear().type('326588332')
			.elementByCss('#myWidgetDiv input#case_search').click()
			.sleep(1000)
			//Select radio button
			.waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="326588332"]/parent::td/preceding-sibling::td//input', 10000).click()
			//click reassign
			.waitForElementByCss('#caseSearchDiv input#case_reassign', 10000).click()
			//Reassign without any user
			.waitForElementByCss('iframe#actionHandler', 1000)
			.frame('actionHandler')
			.waitForElementByCss('input[value=Reassign]', 5000).click()
			.waitForElementByXPath('//div[normalize-space(text())="A new user must be selected"]', 10000)
			.elementByLinkText('OK').click()
			//Replace refresh by some code to click close button
			.refresh()			
			.frame()		
			.waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
			.elementByCss('select#case_OPERATOR option[value=IS]').click()
			.elementByCss('input#case_searchText').clear().type('326588332')
			.elementByCss('#myWidgetDiv input#case_search').click()
			.sleep(1000)
			..waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ManagerUser1"]', 10000)
			.elementByLinkText('Logout').click();		
	})
});