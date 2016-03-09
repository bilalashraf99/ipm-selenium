var wd = require('wd');
var common = require("../../test/common.js");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

describe("AS-1133: OnBoarding - Party Type dropdown does not reset", function () {
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

	it("VALIDATION", function () {
         return browser
			.get(url)
			.elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
			.elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
			.elementByCss('form[name=loginForm] input[type=submit]').click()
			.waitForElementByLinkText('OnBoarding', 80000).click()
			.sleep(5000)
			.waitForElementByCss('iframe', 2000)
			.frame('AppShowFrame')
			.sleep(5000)
			.waitForElementByCss('select#combobox1 option[value=Organization]', 80000).click()
			.elementById('TaxIdDs').type('020258767')
			.elementById('EmailDs').type('solnsengg@gmail.com')
			.elementById('OrganizationNameDsStart').type('Willis Of New Hampshire Inc')
			.elementById('date_Time1_id-inputEl').type('Jan 01, 2016')
			.elementByLinkText('Reset').click()
			.sleep(1000)
			.waitForElementByCss('select#combobox1 option[value=Person]', 80000);			
	})
});