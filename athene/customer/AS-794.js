var wd = require('wd');
var common = require("../../test/common.js");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

describe("AS-794 - Close Case function not changing status to Closed", function () {
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

	it("PREREQUISITES", function () {
        return browser
			//Login to DCM
			.get(dcmUrl)
			.elementByCss('form[name=LoginForm] input[name=LOGINNAME]').type(config.get("sa.username"))
			.elementByCss('form[name=LoginForm] input[name=PASSWORD]').type(config.get("sa.password"))
			.elementByCss('form[name=LoginForm] input[type=SUBMIT]').click()
			//Create Person party - Sellers - 326588332 - Sync with PDB -Yes
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
			.frame().frame("navbar")
			.elementByLinkText('Logout').click()
			.sleep(1000);			
	})
	
	it("VALIDATION - PERSON PARTY - ADDAPPOINTMENT", function () {
        return browser
			.get(url)
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()	
			.waitForElementByLinkText('AddAppointment', 80000).click()
			.sleep(5000)
			.frame('TaskShowFrame')
			.waitForElementById('combobox1', 10000)
			.elementById('textField6').type('326588332')
			.elementByLinkText('Search').click()
			.sleep(5000)
			.waitForElementByXPath('//*[@id="table1"]//div[normalize-space(text())="326588332"]', 10000).click()
			.sleep(5000)
			.waitForElementById('btnShowLicenses_id-btnIconEl', 5000).click()
			.sleep(5000)
			.frame()
			.elementByLinkText('Dashboard', 10000).click()
			.waitForElementByLinkText('AddAppointment', 80000)
			//Search Add Appointment cases
			.waitForElementByCss('select#case_searchField option[value=CASE_NAME]').click()
			.elementByCss('select#case_OPERATOR option[value=LIKE]').click()
			.elementByCss('input#case_searchText').clear().type('AddAppointment')
			.elementByCss('#myWidgetDiv input#case_search').click()
			.sleep(5000)
			//Select radio button with name Fred Sellers
			.waitForElementByXPath('//*[@id="case_SearchResultsDefault"]//td/div[normalize-space(text())="Fred Sellers"]/parent::td/preceding-sibling::td//input', 10000).click()
			//Click Close Case
			.waitForElementById('case_close', 10000).click()			
			.elementByLinkText('Yes').click()
			.waitForElementByLinkText('OK', 1000).click()	
			//Search for Case Status - Close
			.waitForElementByCss('select#case_searchField option[value=STATUS]', 1000).click()
			.elementByCss('select#case_OPERATOR option[value=IS]').click()
			.elementByCss('input#case_searchText').clear().type('Closed')
			.elementByCss('#myWidgetDiv input#case_search').click()
			.sleep(500)
			//Should have Tax ID: 326588332
			.waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="326588332"]').should.eventually.have.length(1)
			.waitForElementByLinkText('Logout',1000).click()
			.sleep(8000);
						
	})
	
	it("VALIDATION ORGANIZATION PARTY - ONBOARDING", function () {
        return browser
			.get(url)
			// Log in as user Analyst User
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()
			// Click OnBoarding link in My Widgets section
			.waitForElementByLinkText('OnBoarding', 80000).click()
			.frame('AppShowFrame')
			.sleep(1000)
			.waitForElementByCss('select#combobox1 option[value=Organization]', 80000).click()
			.elementById('TaxIdDs').type('020258767')
			.elementById('EmailDs').type('solnsengg@gmail.com')
			.elementById('OrganizationNameDsStart').type('Willis Of New Hampshire Inc')
			.elementById('date_Time1_id-inputEl').type('Jan 01, 2016')
			.elementById('createButton').click()
			.sleep(3000)
			.waitForElementByLinkText('OnBoarding', 80000)
			//Select case with tax id 020258767
			.waitForElementByXPath('//*[@id="case_SearchResultsDefault"]//td/div[normalize-space(text())="020258767"]/parent::td/preceding-sibling::td//input', 20000).click()
			//Click Close Case
			.waitForElementById('case_close', 10000).click()			
			.elementByLinkText('Yes').click()
			.waitForElementByLinkText('OK', 1000).click()
			//Search for Tax id - 020258767
			.waitForElementByCss('select#case_searchField option[value=TAX_ID]', 1000).click()
			.elementByCss('select#case_OPERATOR option[value=IS]').click()
			.elementByCss('input#case_searchText').clear().type('020258767')
			.elementByCss('#myWidgetDiv input#case_search').click()
			.sleep(500)
			//Should have Status Closed
			.waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="Closed"]', 10000)
			.waitForElementByLinkText('Logout',1000).click()
			.sleep(8000);			
	})
});