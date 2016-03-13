var wd = require('wd');
var common = require("../../test/common.js");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

describe("AS-933: Step Counter shows X of 0 Tasks", function () {
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

	it("VALIDATION ONBOARDING ", function () {
        return browser
			.get(url)	
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()
			.sleep(1000)
			.waitForElementByLinkText('OnBoarding', 80000).click()
			.waitForElementByCss('iframe',5000)
			.frame('AppShowFrame')
			.sleep(5000)
			.waitForElementById('TaxIdDs', 80000).type('007689629')
			.elementById('EmailDs').clear().type('solnsengg@gmail.com')
			.elementById('FirstNameDsStart').clear().type('Fred')
			.elementById('LastNameDsStart').clear().type('Irving')
			.elementById('dobDS_id-inputEl').clear().type('Jan 01, 1970')
			.elementById('date_Time1_id-inputEl').clear().type('Jan 01, 2016')
			.elementById('createButton').click()
			.sleep(10000)
			.waitForElementByLinkText('OnBoarding', 10000)
			.waitForElementByCss('select#searchField option[value=TAX_ID]').click()
			.elementByCss('input#searchText').type('007689629')
			.sleep(20000)
			.elementByCss('input#search').click()
			.waitForElementByLinkText('EnterDataAndReviewDocs',20000).click()
			.sleep(1000)
			.waitForElementByCss('iframe', 10000)
			.frame('TaskShowFrame')
			.waitForElementByXPath('//div[@id="headerLeftAndNavigationSummary"]/span[@id="headerLeftAndNavigationSummarySpan1"]', 1000).text().should.eventually.include(0)
			.waitForElementByXPath('//div[@id="headerLeftAndNavigationSummary"]/span[@id="headerLeftAndNavigationSummarySpan2"]', 1000).text().should.eventually.include(10)
			.frame()
			.waitForElementByLinkText('Logout',1000).click();
    })
	
	it("PREREQUISITE- Update status in DCM, Initiate OB and complete Perform Eligibity", function () {
        return browser
			.get(dcmUrl)
			.elementByCss('form[name=LoginForm] input[name=LOGINNAME]').type(config.get("sa.username"))
			.elementByCss('form[name=LoginForm] input[name=PASSWORD]').type(config.get("sa.password"))
			.elementByCss('form[name=LoginForm] input[type=SUBMIT]').click()
			.frame('navbar')
			.elementById('Party').click()
			//Update status 
			.frame().frame('container').frame('cacheframe0').frame('subpage')
			.elementById('Field_Person_Main_TaxID_Search_Value').clear().type('007689629').type(wd.SPECIAL_KEYS['Enter'])			
			.sleep(5000)
			.frame().frame('container').frame('cacheframe0').frame('subpage')
            .elementById('Tab_Person_Main_BasicInfo_link').moveTo()
            .elementById('Tab_Person_Main_BasicInfo_Status_link').click()
			.elementByLinkText('Search').moveTo()
			.frame().frame('container').frame('cacheframe0').frame('subpage').frame('component_iframe')
			.elementByLinkText('Update Statuses').click()
			.sleep(5000)	
			.frame().frame('container').frame('cacheframe0').frame('proppage')
			.elementById('NewStatus.StatusCode').type('Active')
			.elementById('NewStatus.StatusCode').click()
			.elementById('Status_StartDate').clear()
			.elementById('Status_StartDate').type('01/01/2016')
			.elementByLinkText('Save').click()
			.elementByLinkText('Save').click()
			.frame().frame("navbar")
			.elementByLinkText('Logout').click()
			.sleep(1000);						
    })
	
	it("VALIDATION NEW AP", function () {
        return browser
			//Login to IPM and create another instance
			.get(url)	
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()
			.sleep(1000)
			.waitForElementByLinkText('OnBoarding', 80000).click()
			.waitForElementByCss('iframe',5000)
			.frame('AppShowFrame')
			.sleep(5000)
			.waitForElementById('TaxIdDs', 80000).type('007689629')
			.elementById('EmailDs').clear().type('solnsengg@gmail.com')
			.elementById('FirstNameDsStart').clear().type('Fred')
			.elementById('LastNameDsStart').clear().type('Irving')
			.elementById('dobDS_id-inputEl').clear().type('Jan 01, 1970')
			.elementById('date_Time1_id-inputEl').clear().type('Jan 01, 2016')
			.elementById('createButton').click()
			.sleep(5000)
			//Perform Eligibility Review - Select Eligible
			.waitForElementByCss('iframe',1000)
			.frame('TaskShowFrame')
			.waitForElementById('combobox1', 8000)
			.waitForElementByCss('select[id=combobox1] option[value="Eligible"]', 8000).click()
			.elementById('combobox1').submit()
			.waitForElementByLinkText('OnBoarding', 10000)
			.waitForElementByCss('select#searchField option[value=ACTIVITY_TYPE]').click()
			.elementByCss('input#searchText').type('New AP')
			.sleep(20000)
			.elementByCss('input#search').click()
			.sleep(2000)
			.waitForElementByLinkText('EnterDataAndReviewDocs',20000).click()
			.sleep(1000)
			.waitForElementByCss('iframe', 10000)
			.frame('TaskShowFrame')
			.waitForElementByXPath('//div[@id="headerLeftAndNavigationSummary"]/span[@id="headerLeftAndNavigationSummarySpan1"]', 1000).text().should.eventually.include(0)
			.waitForElementByXPath('//div[@id="headerLeftAndNavigationSummary"]/span[@id="headerLeftAndNavigationSummarySpan2"]', 1000).text().should.eventually.include(6);
	})
});