var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

it("Create instance - Person", function() {

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
        .elementByCss('select#combobox6 option[value=LLIC]').click()
        .elementByCss('input#checkbox1').click()
        .elementByCss('input#checkbox2').click()
        .elementById('createButton').click()
        .waitForElementById('dashboardPanel', 100000)

        // Wait
        .sleep(8000)

        // Click on Dashboard tab
        .frame()
        .elementByLinkText('Dashboard', 10000).click()

        // Verify new case among search results
        .waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
        .waitForElementByCss('input#case_searchText').type('067600492')
        .waitForElementByCss('input#case_search').click()
        .waitForElementByXPath("//*[@id='case_SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/child::td[@data-qtip='ACTIVATED']")
        .catch(function() {
            return common.retry(10, function() {
                return browser
                    .sleep(5000)
                    .elementByCss('#case_SearchResults a[data-qtip=Refresh]').click()
                    .waitForElementByXPath("//*[@id='case_SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/child::td[@data-qtip='ACTIVATED']")
            });
        })

        // Log out
        .frame()
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
        .frame()
        .frame("container")
        .frame("cacheframe0")
        .frame("subpage")
        .waitForElementByCss('input[name=Field_Person_Main_TaxID_Search_Value]').type('067600492')
        .elementByLinkText('Search').click()
        .waitForElementByCss('table[name=Grid_Person_Main] tbody td:nth-child(2)').text().should.become('Blumberg')
        .elementByCss('table[name=Grid_Person_Main] tbody td:nth-child(5)').text().should.become('067600492')
        .elementByCss('table[name=Grid_Person_Main] tbody td:nth-child(12)').text().should.become('solnsengg@gmail.com')

        // Log out
        .frame()
        .frame("navbar")
        .elementByLinkText('Logout').click();

});
