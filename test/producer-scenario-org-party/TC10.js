var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Send response to BIG and NIPR and complete flow", function() {

    var instanceId;

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Click on My Worksteps tab and get instance number
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementById('assignedDate').click().sleep(500).click()
        .waitForElementByXPath('//div[contains(text(), "371494996")]').text().then(function(result) {
            var len = result.length;
            instanceId = result.substring(len-5, len-1);
        }).sleep(1000)

        // Send response for BIG
        .then(function() {
            return browser.postJson('files/BIG_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse', instanceId);
        })

        // Send response for NIPR
        .then(function() {
            return browser.postJson('files/NIPR_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse', instanceId);
        })

        // Click on Dashboard tab and verify search results
        .sleep(2000)
        .frame()
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
        .elementByCss('input#case_searchText').type('371494996')
        .elementByCss('input#case_search').click()
        .waitForElementByXPath("//*[@id='case_SearchResultsDefault']/descendant::td[@data-qtip='371494996']/parent::tr/child::td[@data-qtip='National Benefits Group Llc Dba Greenway Financial']/parent::tr/child::td[@data-qtip='COMPLETED']", 10000)

        // Log out
        .elementByLinkText('Logout').click();

});
