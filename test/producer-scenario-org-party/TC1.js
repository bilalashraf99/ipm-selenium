var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Initiate New Onboarding process", function() {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'ebms'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("ebms.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("ebms.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Navigate to User Management under Administration tab and click Add button
        .waitForElementByLinkText('Administration', 10000).click()
        .waitForElementByLinkText('User Management', 10000).click()
        .elementByCss('span.x-btn-button span.bmAdd').click()

        // Fill form with user data and submit
        .frame('createPanelIframe')
        .elementByCss('input[name=userName]').type('020258767')
        .elementByCss('input[name=password]').type('password')
        .elementByCss('input[name=confPassword]').type('password')
        .elementByCss('input[name=firstName]').type('Willis of New Hampshire')
        .elementByCss('input[name=lastName]').type('Inc')
        .elementByCss('input[name=email]').type('solnsengg@gmail.com')
        .elementByCss('input[name=createUser]').click()

        // Log out
        .frame()
        .elementByLinkText('Logout').click()

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click OnBoarding link in My Widgets section
        .waitForElementByLinkText('OnBoarding', 10000).click()

        // Fill form with organization data and submit
        .frame('AppShowFrame')
        .waitForElementByCss('select#combobox1 option[value=Organization]').click()
        .elementById('TaxIdDs').type('020258767')
        .elementById('EmailDs').type('solnsengg@gmail.com')
        .elementById('OrganizationNameDsStart').type('Willis Of New Hampshire Inc')
        .elementByCss('select#combobox6 option[value="IFS Bank"]').click()
        .elementById('createButton').click()
        .sleep(2000)
        //.waitForElementByCss('.x-message-box .x-header-text').text().should.eventually.not.contain('error')

        // Click on Dashboard tab and check new case among search results
        .frame()
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
        .waitForElementByCss('input#case_searchText').type('020258767')
        .waitForElementByCss('input#case_search').click()
        .waitForElementByXPath("//*[@id='case_SearchResults']/descendant::td[@data-qtip='020258767']/parent::tr/child::td[@data-qtip='Willis Of New Hampshire Inc']/parent::tr/child::td[@data-qtip='ACTIVATED']", 10000)

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
