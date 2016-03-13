var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Create instance", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        .initiateOrganizationOnboarding('208949993', 'solnsengg@gmail.com', 'WATSON FINANCIAL SERVICES INC', 'LLIC', true, false)

        // Wait
        .sleep(8000)

        .verifyNewCase('208949993', 'WATSON FINANCIAL SERVICES INC')

        // Verify task in My Tasks section
        .elementByCss('#basicSearchDiv input#search').click()
        .waitForElementByXPath("//*[@id='SearchResults']//a[normalize-space(text())='EnterDataAndReviewDocs']")

        // Click on My Worksteps tab
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementByXPath('//div[normalize-space(text())="Enter Data & Review Docs"]/parent::td/following-sibling::td//a[normalize-space(text())="AnalystUser1"]')

        // Log out
        .elementByLinkText('Logout').click();

});
