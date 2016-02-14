var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Create instance", function () {

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
        .elementByCss('#combobox1 option[value=Organization]').click()
        .elementById('TaxIdDs').type('020258767')
        .elementById('EmailDs').type('solnsengg@gmail.com')
        .elementById('OrganizationNameDsStart').type('Willis Of New Hampshire Inc')
        .elementByCss('#combobox6 option[value=LLIC]').click()
        .elementById('checkbox1').click()
        .elementById('checkbox2').click()
        .elementById('createButton').click()
        .sleep(2000)
        .waitForElementByCss('.x-message-box .x-header-text').text().should.eventually.not.contain('error')

        // Click on My Worksteps tab
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementByXPath('//div[normalize-space(text())="Enter Data & Review Docs"]/parent::td/following-sibling::td//a[normalize-space(text())="AnalystUser1"]')

        // Click on Dashboard tab and verify new case among search results
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('#case_SearchResultsDefault a[data-qtip=Refresh]').click()
        .waitForElementByXPath("//*[@id='case_SearchResultsDefault']/descendant::td[@data-qtip='020258767']/parent::tr/child::td[@data-qtip='Willis Of New Hampshire Inc']/parent::tr/child::td[@data-qtip='ACTIVATED']", 10000)

        // Verify task in My Tasks section
        .elementByCss('#basicSearchDiv input#search').click()
        .waitForElementByXPath("//*[@id='SearchResults']//a[normalize-space(text())='EnterDataAndReviewDocs']")

        // Log out
        .elementByLinkText('Logout').click();

});
