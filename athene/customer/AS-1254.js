var wd = require('wd');
var common = require("../../test/common.js");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

describe("AS-1276: Reassign Case to Me - Shouldn't require second Search", function () {
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

	it("Prerequisites in DCM, Create Person party - Sellers - 326588332 - Sync with PDB -Yes, Update Status", function () {
        return browser
			.get(dcmUrl)
			.elementByCss('form[name=LoginForm] input[name=LOGINNAME]').type(config.get("sa.username"))
			.elementByCss('form[name=LoginForm] input[name=PASSWORD]').type(config.get("sa.password"))
			.elementByCss('form[name=LoginForm] input[type=SUBMIT]').click()
			.frame('navbar')
			.elementById('Party').click()   	 
		    .frame().frame('container').frame('cacheframe0').frame('subpage')
            .elementById('Button_Person_Main_NewPerson').click()
            .frame().frame('container').frame('cacheframe0').frame('proppage')
			.elementById('Party.FirstName').type('Fred')
			.elementById('Party.LastName').type('Sellers')
            .elementById('Party.BirthDate').type('01/01/1970')
            .elementByCss('select[name=SyncPDB] option[value=Yes]').click()
			.frame().frame('container').frame('cacheframe0').frame('proppage')
			.elementById('Party.TaxID').type('326588332')
            .elementById('RoleDISTRIBUTOR').click()
            .elementById('ContactPoint.Address.Street1').type('Street1')
            .elementById('ContactPoint.Address.City').type('City1')
            .elementById('ZipCode').type('12345')
			.elementById('save').click()
			.sleep(5000)
			.frame().frame('container').frame('cacheframe0').frame('subpage')
            .elementById('Tab_Person_Main_BasicInfo_link').moveTo()
            .elementById('Tab_Person_Main_BasicInfo_Status_link').click()
			.elementByLinkText('Search').moveTo()		
			.frame().frame('container').frame('cacheframe0').frame('subpage').frame('component_iframe')			
			.elementByLinkText('Update Statuses').click()
			.sleep(500)	
			.frame().frame('container').frame('cacheframe0').frame('proppage')
			.elementById('NewStatus.StatusCode').type('Cancelled')
			.elementById('NewStatus.StatusCode').click()
			.elementById('NewStatus.StatusReason').type('Dissolved')
			.elementById('NewStatus.StatusReason').click()
			.elementById('Status_StartDate').clear()
			.elementById('Status_StartDate').type('01/01/2016')
			.elementByLinkText('Save').click()
			.elementByLinkText('Save').click()
			.frame().frame("navbar")
			.elementByLinkText('Logout').click()
			.sleep(1000);
	})

	it("Validation in IPM for Sellers - 326588332", function () {
        return browser
			// Login as Analyst User
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
			.sleep(8000)
			
			//Perform Eligibility Review task - Select Agent Review
			.frame('TaskShowFrame')
			.waitForElementById('combobox1', 8000)
			.waitForElementByCss('select[id=combobox1] option[value="Agent Review"]', 8000).click()
			.elementById('combobox1').submit()
			.sleep(5000)
			
			//Logout
			.waitForElementByLinkText('Logout',5000).click()			
			
			//Login as ComplianceUser1
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type('ComplianceUser1')
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type('ComplianceUser1')
			.elementByCss('form[name=loginForm] input[type=submit]').click()			
			
			//Click on Get New Task, go to Dashboard and verify if task is present in My Tasks		
			.waitForElementByLinkText('OnBoarding', 10000)
			.waitForElementByXPath('//*[@id="basicSearchDiv"]/table/tbody/tr[2]/td[3]/input', 10000).click()			
			
			// Validate task is assigned to ComplianceUser1 on Dashboard
			.frame()
			.elementByLinkText('Dashboard', 10000).click()
			.waitForElementByLinkText('AgentReviewNotRecontractable', 100000)			
			
			//Logout
			.waitForElementByLinkText('Logout',1000).click()			
			
			//Login as Analyst User
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()
			.waitForElementByLinkText('OnBoarding', 10000)
			.sleep(5000)			
			
			//Select radio button and Click assign to me
			.waitForElementByXPath('//*[@id="case_SearchResultsDefault"]//td/div[normalize-space(text())="326588332"]/parent::td/preceding-sibling::td//input', 10000).click()
			.elementById('case_AssignToMe').isEnabled().should.eventually.be.true
			.waitForElementById('case_AssignToMe', 10000).click()			
			
			//Verify no 2nd window displayed. Only confirmation message is displatyed
			.waitForElementById('messagebox-1001', 10000)
			.elementByLinkText('Yes').click()			
			
			//Refresh Dashboard and Validate that AgentReviewNotRecontractable task should be Reassigned to Analyst User
			.frame()
			.elementByLinkText('Dashboard', 10000).click()
			.waitForElementByLinkText('AgentReviewNotRecontractable', 10000)			
			
			//Logout
			.waitForElementByLinkText('Logout',1000).click();
	})
});