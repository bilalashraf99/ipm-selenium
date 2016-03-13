var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("ReviewApptResponseFromNIPR- Add Appointments - Org party", function() {

    var instanceId;

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Click on ReviewApptResponseFromNIPR
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('020258767')
        .elementByCss('input#search').click()
        .waitForElementByLinkText('ReviewApptResponseFromNIPR', 10000).click()

        // Ensure Add Appointments is checked and Submit
        .frame('TaskShowFrame')
        .waitForElementByCss('input[value="Add Appointments"]').click()
        .elementByCss('input[value=Submit]').click()

        // Wait
        .sleep(8000)

        // Click on My Worksteps tab and get instance number
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementById('assignedDate').click().sleep(500).click()
        .waitForElementByXPath('//div[contains(text(), "020258767")]').text().then(function(result) {
            var len = result.length;
            instanceId = result.substring(len-5, len-1);
        }).sleep(1000)

        // Send response for NIPR
        .then(function() {
            return browser.postJson('files/NIPR_Request.txt', '/sbm/cxfws/NIPRResponseReceiver/postNIPRResponse', instanceId);
        })

        // Wait
        .sleep(8000)

        // Verify case completed TODO: will need to retry
        .frame()
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
        .waitForElementByCss('input#case_searchText').type('020258767')
        .waitForElementByCss('input#case_search').click()
        .waitForElementByXPath("//*[@id='case_SearchResults']/descendant::td[@data-qtip='020258767']/parent::tr/child::td[@data-qtip='Willis Of New Hampshire Inc']/parent::tr/child::td[@data-qtip='COMPLETED']", 10000)

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
