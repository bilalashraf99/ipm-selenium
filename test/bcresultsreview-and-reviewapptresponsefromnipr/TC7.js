var wd = require('wd');

var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Create instance (2)", function () {

    return browser
    // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click OnBoarding link in My Widgets section
        .waitForElementByLinkText('OnBoarding', 10000).click()

        // Fill form with Organization data and submit
        .frame('AppShowFrame')
        .elementById('TaxIdDs').type('067600492')
        .elementById('EmailDs').type('solnsengg@gmail.com')
        .elementById('FirstNameDsStart').type('John')
        .elementById('LastNameDsStart').type('Blumberg')
        .elementByCss('select#combobox6 option[value=LLIC]').click()
        .elementById('checkbox1').click()
        .elementById('checkbox2').click()
        .elementById('createButton').click()
        .sleep(2000)
        .waitForElementByCss('.x-message-box .x-header-text').text().should.eventually.not.contain('error')

        // Click on Dashboard tab and verify new case among search results
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('#case_SearchResultsDefault a[data-qtip=Refresh]').click()
        .waitForElementByXPath("//*[@id='case_SearchResultsDefault']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/child::td[@data-qtip='ACTIVATED']", 10000)

        // Log out
        .elementByLinkText('Logout').click();

});
