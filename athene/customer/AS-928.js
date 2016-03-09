var wd = require('wd');
var common = require("../../test/common.js");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

describe("AS-928: Remove Contract Kit Provider from Basic Info section on Data Entry", function () {
    this.timeout(600000);
    var config = common.config;
    before(function () {
        return browser
            .init(config.get("environment"))
            .setWindowSize(1200, 1000);
    });

	after(function () {
        return browser.quit();
    });

	it("VALIDATION FOR PERSON PARTY", function () {
        return browser
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
			.sleep(10000)
			.waitForElementByLinkText('OnBoarding', 10000)
			.waitForElementByCss('select#searchField option[value=TAX_ID]').click()
			.elementByCss('input#searchText').type('326588332')
			.elementByCss('input#search').click()
			.sleep(10000)
			.waitForElementByLinkText('EnterDataAndReviewDocs',10000).click()
			.waitForElementByCss('iframe', 10000)
			.frame('TaskShowFrame')
			.waitForElementByLinkText('Basic Information',10000).click()
			.elementByCss('table[id=table1] tbody').text().should.eventually.not.include('Contract Kit Provider')
			.elementByCss('table[id=table1] tbody').text().should.eventually.include('Employee')
			.waitForElementByLinkText('Logout',1000).click()
			.sleep(8000);
    })
	
	it("VALIDATION FOR ORGANIZATION PARTY", function () {
        return browser
			.get(url)	
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()			
			// Initiate OnBoarding for - Willis Of New Hampshire
			.waitForElementByLinkText('OnBoarding', 80000).click()
			.frame('AppShowFrame')
			.sleep(5000)
			.waitForElementByCss('select#combobox1 option[value=Organization]', 80000).click()
			.elementById('TaxIdDs').type('020258767')
			.elementById('EmailDs').type('solnsengg@gmail.com')
			.elementById('OrganizationNameDsStart').type('Willis Of New Hampshire Inc')
			.elementById('date_Time1_id-inputEl').type('Jan 01, 2016')
			.elementById('createButton').click()
			.sleep(10000)
			.waitForElementByLinkText('OnBoarding', 10000)
			.waitForElementByCss('select#searchField option[value=TAX_ID]').click()
			.elementByCss('input#searchText').type('020258767')
			.elementByCss('input#search').click()
			.sleep(10000)
			.waitForElementByLinkText('EnterDataAndReviewDocs',10000).click()
			.waitForElementByCss('iframe', 10000)
			.frame('TaskShowFrame')
			.waitForElementByLinkText('Basic Information',10000).click()
			.elementByCss('table[id=table1] tbody').text().should.eventually.not.include('Contract Kit Provider')
			.waitForElementByLinkText('Logout',1000).click();
    })

});