var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Initiate OB process - Person party", function() {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click OnBoarding link in My Widgets section
        .waitForElementByLinkText('OnBoarding', 10000).click()

        // Fill form with user data and submit
        .frame('AppShowFrame')
        .elementById('TaxIdDs').type('067600492')
        .elementById('EmailDs').type('solnsengg@gmail.com')
        .elementById('FirstNameDsStart').type('John')
        .elementById('LastNameDsStart').type('Blumberg')
        .elementByCss('select#combobox6 option[value="LLIC"]').click()
        .elementById('checkbox2').click()
        .elementById('createButton').click()
        .sleep(5000)
        //.waitForElementByCss('.x-message-box .x-header-text').text().should.eventually.not.contain('error')

        // Click on Dashboard tab
        .frame()
        .elementByLinkText('Dashboard', 10000).click()

        // Verify new case among search results
        .waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
        .waitForElementByCss('input#case_searchText').type('067600492')
        .waitForElementByCss('input#case_search').click()
        .waitForElementByXPath("//*[@id='case_SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/child::td[@data-qtip='ACTIVATED']", 10000)

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
