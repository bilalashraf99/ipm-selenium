var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Send response to BIG and NIPR and complete flow", function() {

    var instanceId;

    return browser
        // Load login page
        .get(url).windowHandle()

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click on My Worksteps tab and get instance number
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementById('assignedDate').click().sleep(500).click()
        .waitForElementByXPath('//div[contains(text(), "067600492 ")]').text().then(function(result) {
            var len = result.length;
            instanceId = result.substring(len-5, len-1);
        }).sleep(1000)

        // Send response for BIG
        .postJson('files/BIG_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse', instanceId)

        // Send response for NIPR
        .postJson('files/NIPR_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse', instanceId)

        // Click on Dashboard tab and verify search results
        .sleep(2000)
        .frame()
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
        .elementByCss('input#case_searchText').type('067600492')
        .elementByCss('input#case_search').click()
        .waitForElementByXPath("//*[@id='case_SearchResultsDefault']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/child::td[@data-qtip='COMPLETED']", 10000)
        .elementByCss('input#search').click()
        .waitForElementByXPath("//*[@id='SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/descendant::div[normalize-space(text())='Approval']")
        .elementByXPath("//*[@id='SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/descendant::div[normalize-space(text())='ReviewTaxIdVerification']")
        .elementByXPath("//*[@id='SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/descendant::div[normalize-space(text())='Select Upline']")

        // Log out
        .elementByLinkText('Logout').click();

});
