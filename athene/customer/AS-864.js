var wd = require('wd');
var common = require("../../test/common.js");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

describe("AS-864: Reset Button Doesn't work on Task Advanced Search", function () {
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

	it("PREREQUISITE - Create OB instance ", function () {
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
			.sleep(1000);			
    })
	
	it("VALIDATION ", function () {
        return browser
			.get(url)	
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()
			.sleep(1000)
			.waitForElementByLinkText('OnBoarding', 10000)
			.sleep(1000)
			.waitForElementByCss('div#basicSearchDiv input[id=advSearch').click()
			.waitForElementByCss('div#advSearchDiv select[id=selTaskName] option[value=EnterDataAndReviewDocs]').click()
			.sleep(200)
			.waitForElementByCss('div#advSearchDiv select[id=selCaseOwner]', 500).type(wd.SPECIAL_KEYS['Down arrow']).click()
			.waitForElementByCss('div#advSearchDiv select[id=selCaseOwner]', 500).click()
			.sleep(200)
			.waitForElementByCss('div#advSearchDiv select[id=selStatus] option[value=ASSIGNED]', 500).click()
			.waitForElementByCss('div#advSearchDiv select[id=selAppName] option[value=Onboarding]', 500).click()
			.waitForElementByCss('div#advSearchDiv input[id=txtName]', 500).clear().type('abc')
			.waitForElementByCss('div#advSearchDiv input[id=txtTaxId]', 500).clear().type('1234')
			.waitForElementByCss('div#advSearchDiv input[id=txtCaseNum]', 500).clear().type('1234')
			//Reset
			.waitForElementByCss('div#advSearchDiv input[value=Reset]', 500).click()
			//Validate
			.waitForElementByCss('div#advSearchDiv select[id=selTaskName] option[value="NO_SELECTION"]').isSelected().should.eventually.be.true
			.waitForElementByCss('div#advSearchDiv select[id=selCaseOwner] option[value="NO_SELECTION"]').isSelected().should.eventually.be.true
			.waitForElementByCss('div#advSearchDiv select[id=selStatus] option[value=NO_SELECTION]').isSelected().should.eventually.be.true
			.waitForElementByCss('div#advSearchDiv select[id=selAppName] option[value=NO_SELECTION]').isSelected().should.eventually.be.true
			.waitForElementByCss('div#advSearchDiv input[id=txtName]').text().should.eventually.become('')
			.waitForElementByCss('div#advSearchDiv input[id=txtTaxId]').text().should.eventually.become('')
			.waitForElementByCss('div#advSearchDiv input[id=txtCaseNum]').text().should.eventually.become('');
    })
});