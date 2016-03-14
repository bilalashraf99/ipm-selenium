var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Reject Onboarding", function () {

    var approvalXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='326588332']/parent::tr/child::td[@data-qtip='Fred Sellers']/parent::tr/descendant::a[normalize-space(text())='Approval']";

    var nested = function(e) {
        return browser
            .elementByCss('#SearchResults a[data-qtip="Next Page"]:not(.x-btn-disabled)').then(function(ref){
                return ref.click()
                    .waitForElementByXPath(approvalXPath)
                    .catch(nested);
            });
    };

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Click on new Approval task among search results
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('326588332')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(approvalXPath)
        .catch(nested).click()

        // Enter comment and Reject
        .waitForElementByCss('iframe')
        .frame('TaskShowFrame')
        .elementByCss('textarea#txaCurrComm').type("OB application rejected by AnalystUser1")
        .elementByCss('input[value=Reject]').click().sleep(5000)

        // Click on Dashboard tab
        .frame()
        .elementByLinkText('Dashboard', 10000).click()

        // Verify task with Completed status
        .waitForElementByCss('select#case_searchField1 option[value=TAX_ID]').click()
        .elementByCss('input#case_searchText').type('326588332')
        .elementByCss('input#case_search').click()
        .waitForElementByXPath("//*[@id='case_SearchResults']/descendant::td[@data-qtip='326588332']/parent::tr/child::td[@data-qtip='Fred Sellers']/parent::tr/child::td[@data-qtip='COMPLETED']")

        // Click on My Worksteps tab
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()

        // Log out
        .elementByLinkText('Logout').click();

});
