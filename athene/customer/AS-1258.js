var common = require("../../test/common.js");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

describe("AS-1258: Validation error is not displayed for incorrect combination of Last Name and TAXID in Inititate New Producer Onboarding screen", function () {
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
    
    it("PERSON SCENARIO - CORRECT TAX ID, INCORRECT LAST NAME", function () {
        return browser
			// Load login page
			.get(url)
			// Log in as user 'AnalystUser1'
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()
			// Click OnBoarding link in My Widgets section
			.waitForElementByLinkText('OnBoarding', 80000).click()
			.frame('AppShowFrame')
			.waitForElementById('TaxIdDs', 80000).type('123456789')
			.elementById('EmailDs').type('solnsengg@gmail.com')
			.elementById('FirstNameDsStart').type('FirstName')
			.elementById('LastNameDsStart').type('LastName')
			.elementById('dobDS_id-inputEl').type('Jan 01, 1990')
			.elementById('date_Time1_id-inputEl').type('Jan 01, 2016')
			.elementById('createButton').click()
			.sleep(3000)
			//Validate Error message
			.elementById('messagebox-1001-displayfield-inputEl').text().should.become('This Party was not found in NIPR. Please correct the data or cancel the Onboarding of this party.')
			.elementById('button-1005-btnInnerEl').click()
			.elementByLinkText('Cancel').click()
			.sleep(1000);
    })
	
	it("PERSON SCENARIO - INCORRECT TAX ID, CORRECT LAST NAME", function () {
        return browser
			// Click OnBoarding link in My Widgets section
			.waitForElementByLinkText('OnBoarding', 80000).click()
			.frame('AppShowFrame')
			.waitForElementById('TaxIdDs', 80000).type('123456789')
			.elementById('TaxIdDs').type('123456789')
			.elementById('EmailDs').type('solnsengg@gmail.com')
			.elementById('FirstNameDsStart').type('FirstName')
			.elementById('LastNameDsStart').type('Blumberg')
			.elementById('dobDS_id-inputEl').type('Jan 01, 1990')
			.elementById('date_Time1_id-inputEl').type('Jan 01, 2016')
			.elementById('createButton').click()
			.sleep(3000)
			//Validate Error message
			.elementById('messagebox-1001-displayfield-inputEl').text().should.become('This Party was not found in NIPR. Please correct the data or cancel the Onboarding of this party.')
			.elementById('button-1005-btnInnerEl').click()
			.elementByLinkText('Cancel').click()
			.sleep(1000);
    })
	        
	it("ORGANIZATION SCENARIO - INCORRECT TAX ID, CORRECT LAST NAME", function () {
        return browser
			// Click OnBoarding link in My Widgets section
			.waitForElementByLinkText('OnBoarding', 80000).click()
			.frame('AppShowFrame')
			.sleep(1000)
			.waitForElementByCss('select#combobox1 option[value=Organization]', 80000).click()
			.elementById('TaxIdDs').type('123456789')
			.elementById('EmailDs').type('solnsengg@gmail.com')
			.elementById('OrganizationNameDsStart').type('Willis Of New Hampshire Inc')
			.elementById('date_Time1_id-inputEl').type('Jan 01, 2016')
			.elementById('createButton').click()
			.sleep(3000)
			//Validate Error message
			.elementById('messagebox-1001-displayfield-inputEl').text().should.become('This Party was not found in NIPR. Please correct the data or cancel the Onboarding of this party.')
			.elementById('button-1005-btnInnerEl').click()
			.elementByLinkText('Cancel').click()
			.sleep(1000);
    })
	
	it("ORGANIZATION SCENARIO - CORRECT TAX ID, INCORRECT LAST NAME", function () {
        return browser
			// Click OnBoarding link in My Widgets section
			.waitForElementByLinkText('OnBoarding', 80000).click()
			.frame('AppShowFrame')
			.sleep(1000)
			.waitForElementByCss('select#combobox1 option[value=Organization]', 80000).click()		
			.elementById('TaxIdDs').type('020258767')
			.elementById('EmailDs').type('solnsengg@gmail.com')
			.elementById('OrganizationNameDsStart').type('TestCompany')
			.elementById('date_Time1_id-inputEl').type('Jan 01, 2016')
			.elementById('createButton').click()
			.sleep(3000)
			//Validate Error message
			.elementById('messagebox-1001-displayfield-inputEl').text().should.become('This Party was not found in NIPR. Please correct the data or cancel the Onboarding of this party.')
			.elementById('button-1005-btnInnerEl').click()
			.elementByLinkText('Cancel').click()
			.sleep(1000);
    })
});