var wd = require('wd');
var common = require("../../test/common.js");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

var caseNumber = 0;

var getCaseNumber = function() {
		caseNumber = browser.elementByCss('div[id=case_SearchResults] table tbody tr:nth-child(1) td:nth-child(3)').text();
        return caseNumber;
    };

describe("AS-852: Tasks Search - Doesn't Work when Status = Queued", function () {
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
    
	it("PREREQUISITES - Create Person Party in DCM", function () {
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
			.sleep(5000);
	})
	
	it("PREREQUISITES: Create Organization Party in DCM  and Initiate Add Appointment", function () {
        return browser
			//Create party in DCM
			.frame('navbar')
			.elementById('Party').click()
			.frame().frame('container').frame('cacheframe0').frame('subpage')
			.elementByCss('#Search_Person_Main_primary_display_div select option[value=Menu_Party_Org]').click()
			.frame().frame('container').frame('cacheframe0').frame('subpage')
			.elementById('Button_Org_Main_NewOrg').click()
			.frame().frame('container').frame('cacheframe0').frame('proppage')
			.elementById('Party.Name').type('Willis Of New Hampshire Inc')
			.elementById('Party.TaxID').type('020258767')
			.elementByCss('select[name=SyncPDB] option[value=Yes]').click()
			.elementByCss('input[name=RoleDISTRIBUTOR]').click()
			.elementById('ContactPoint.Address.Street1').type('Street1')
			.elementById('ContactPoint.Address.City').type('City1')
			.elementById('ZipCode').type('44444')
			.elementById('save').click()
			.sleep(5000)
			.frame().frame("navbar")
			.elementByLinkText('Logout').click()
			.sleep(1000)
			
			//Initiate Add Appointment
			.get(url)
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()
			.waitForElementByLinkText('AddAppointment', 80000).click()
			.sleep(5000)
			.frame('TaskShowFrame')
			.waitForElementById('combobox1', 10000).click().type(wd.SPECIAL_KEYS['Down arrow']).click()
			.elementById('textField6').type('020258767')
			.elementByLinkText('Search').click()
			.sleep(5000)
			.waitForElementByXPath('//*[@id="table1"]//div[normalize-space(text())="020258767"]', 50000).click()
			.waitForElementById('btnShowLicenses_id-btnIconEl', 10000).click()
			.sleep(8000)
			.frame()
			.elementByLinkText('Dashboard', 10000).click()
			.waitForElementByLinkText('AddAppointment', 80000);
	})

	it("VALIDATION - Filter by Status Queued", function () {
        return browser
			.sleep(5000)		
			.elementByCss('select#searchField option[value=STATUS]').click()
			.elementByCss('input#searchText').clear().type('QUEUED')
			.elementByCss('#searchDIV input#search').click()
			.sleep(5000)
			.waitForElementByXPath('//*[@id="SearchResults_grid"]//td/div[normalize-space(text())="QUEUED"]', 10000).should.eventually.have.length(2)
			.waitForElementByXPath('//*[@id="SearchResults_grid"]//td/div[normalize-space(text())="020258767"]', 10000)
			.waitForElementByXPath('//*[@id="SearchResults_grid"]//td/div[normalize-space(text())="326588332"]', 10000);
	})	
});