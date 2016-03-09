var wd = require('wd');
var common = require("../../test/common.js");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

describe("AS-470: Analyst Work Page - Case Search needs Assign Case to Me", function () {
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
			// Login as Analyst User
			.get(url)		
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()
			
			// Initiate OnBoarding for - John Blumberg
			.waitForElementByLinkText('OnBoarding', 10000).click()
			.frame('AppShowFrame')			
			.elementById('TaxIdDs').clear().type('067600492')
			.elementById('EmailDs').clear().type('solnsengg@gmail.com')
			.elementById('FirstNameDsStart').clear().type('John')
			.elementById('LastNameDsStart').clear().type('Blumberg')
			.elementById('dobDS_id-inputEl').clear().type('Jan 01, 1970')
			.elementById('date_Time1_id-inputEl').clear().type('Jan 01, 2016')
			.elementById('createButton').click()
			.sleep(8000)
			
			.waitForElementByLinkText('OnBoarding', 80000)
			//Reassing case to me radio button should be disabled before selecting a case
			.waitForElementById('case_AssignToMe', 10000).isEnabled().should.eventually.be.false
			
			//Reassign case to me radio button should be enabled only selecting a case
			.waitForElementByXPath('//*[@id="case_SearchResultsDefault"]//td/div[normalize-space(text())="067600492"]/parent::td/preceding-sibling::td//input', 10000).click()
			.waitForElementById('case_AssignToMe', 10000).isEnabled().should.eventually.be.true			
			//Logout
			.waitForElementByLinkText('Logout',1000).click();
	})
});