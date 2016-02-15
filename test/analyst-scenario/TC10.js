var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");
var dcmUrl = config.get("dcm.url");

it("Create instance - Org", function () {

    var selectSubpageFrame0 = function() {
        return browser.frame().frame("container").frame("cacheframe0").frame("subpage");
    };

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
        //.waitForElementByCss('.x-message-box .x-header-text').text().should.eventually.not.contain('error')

        // Click on My Worksteps tab
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementByXPath('//div[normalize-space(text())="Enter Data & Review Docs"]/parent::td/following-sibling::td//a[normalize-space(text())="AnalystUser1"]')

        // Click on Dashboard tab and verify new case among search results
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('#case_SearchResultsDefault a[data-qtip=Refresh]').click()
        .waitForElementByXPath("//*[@id='case_SearchResultsDefault']/descendant::td[@data-qtip='020258767']/parent::tr/child::td[@data-qtip='Willis Of New Hampshire Inc']/parent::tr/child::td[@data-qtip='ACTIVATED']", 10000)

        // Log out
        .elementByLinkText('Logout').click()

        // Load DCM login page
        .get(dcmUrl)

        // Log in as user 'sa'
        .elementByCss('form[name=LoginForm] input[name=LOGINNAME]').type(config.get("sa.username"))
        .elementByCss('form[name=LoginForm] input[name=PASSWORD]').type(config.get("sa.password"))
        .elementByCss('form[name=LoginForm] input[type=SUBMIT]').click()

        // Navigate to Party -> Party
        .frame("navbar")
        .waitForElementByCss('a#Party').click()

        // Perform search on Tax ID
        .then(selectSubpageFrame0)
        .waitForElementByCss('#Search_Person_Main_primary_display_div select option[value=Menu_Party_Org]').click()
        .then(selectSubpageFrame0)
        .waitForElementByCss('input[name=Field_Org_Main_TaxID_Search_Value]').type('020258767')
        .elementByLinkText('Search').click()
        .waitForElementByCss('table[name=Grid_Org_Main] tbody td:nth-child(2)').text().should.become('WILLIS OF NEW HAMPSHIRE INC')
        .elementByCss('table[name=Grid_Org_Main] tbody td:nth-child(4)').text().should.become('020258767')
        .elementByCss('table[name=Grid_Org_Main] tbody td:nth-child(11)').text().should.become('solnsengg@gmail.com')

        // Log out
        .frame()
        .frame("navbar")
        .elementByLinkText('Logout').click();

});
