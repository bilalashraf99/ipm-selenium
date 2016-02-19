var common = require("../common");
var browser = common.browser;

it("Upload Documents and ESignature - Expand, Collapse and Validate sections", function () {

    return browser
        // Expand all sections
        .elementByLinkText('Expand All').click()

        // Verify sections incomplete
        .elementById('uploadDocumentsHeaderStatus').text().should.become("incomplete")
        .elementById('eSignDocumentsHeaderStatus').text().should.become("incomplete")
        .elementById('headerLeftAndNavigationSummary').text().should.become("0 of 2 steps complete")

        // Collapse all sections
        .elementByLinkText('Collapse All').click()

        // Verify content hidden
        .elementById('uploadDocumentsContentDiv').isDisplayed().should.eventually.be.false
        .elementById('eSignDocumentsContentDiv').isDisplayed().should.eventually.be.false

        // Click Show Task button
        .frame()
        .elementByLinkText('Show Task').click()

        // Open Upload Document section and verify
        .frame('TaskShowFrame')
        .sleep(2000)
        .waitForElementById('uploadDocumentsNavLink').click()
        .waitForElementByXPath('//div[@id="RequiredDocNamesDiv"]//td[normalize-space(text())="W-9"]/parent::tr//span[contains(text(), "*required")]')
        .waitForElementByXPath('//div[@id="RequiredDocNamesDiv"]//td[normalize-space(text())="Proof of E & O"]/parent::tr//span[contains(text(), "*required")]')
        .waitForElementByXPath('//div[@id="RequiredDocNamesDiv"]//td[normalize-space(text())="License"]/parent::tr//span[contains(text(), "*required")]')
        .waitForElementByXPath('//div[@id="RequiredDocNamesDiv"]//td[normalize-space(text())="Direct Deposit"]/parent::tr//span[contains(text(), "*required")]')

        // Open E-Sign Documents section and verify
        .waitForElementById('eSignDocumentsNavLink').click()
        .waitForElementByLinkText('CA Agreement Amendment')
        .waitForElementByLinkText('General Agreement.doc');

});
