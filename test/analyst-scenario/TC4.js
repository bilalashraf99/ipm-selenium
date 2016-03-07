var common = require("../common");
var browser = common.browser;

it("EnterDataAndReviewDocs - Submit form - Person", function() {

    return browser
        // Fill in Upload Documents form with first invalid set of data
        .elementById('uploadDocumentsHeader').click()
        .elementsByXPath('//div[@id="RequiredDocNamesTableDiv"]//input[@value="No" and not(contains(@id,"Rejected_No"))]').then(common.clickAll)
        .elementsByXPath('//div[@id="RequiredDocNamesTableDiv"]//input[contains(@id,"_Rejected_yes")]').then(common.clickAll)
        .elementsByXPath('//div[@id="RequiredDocNamesTableDiv"]//*[contains(text(), "*required")]').then(function(elements) {
            return elements.should.have.length(4);
        })
        .elementByCss('input[value=Submit]').click()
        .waitForElementByCss('.x-message-box span.x-btn-button').click()
        .elementsByCss('#RequiredDocNamesTableDiv select option[value="not required"]').then(common.clickAll)
        .elementsByCss('#RequiredDocNamesTableDiv').text().should.eventually.not.include("*required")
        .elementById('uploadDocumentsHeader').click()
        .elementById('uploadDocumentsHeaderStatus').text().should.become("incomplete")

        // Fill in Upload Documents form with second invalid set of data
        .elementById('uploadDocumentsHeader').click()
        .elementsByXPath('//div[@id="RequiredDocNamesTableDiv"]//input[@value="Yes" and not(contains(@id,"Rejected_yes"))]').then(common.clickAll)
        .elementById('uploadDocumentsHeader').click()
        .elementById('uploadDocumentsHeaderStatus').text().should.become("incomplete")

        // Fill in Upload Documents form with valid set of data
        .elementById('uploadDocumentsHeader').click()
        .elementsByXPath('//div[@id="RequiredDocNamesTableDiv"]//input[contains(@id,"_Rejected_No")]').then(common.clickAll)
        .elementById('uploadDocumentsHeader').click()
        .elementById('uploadDocumentsHeaderStatus').text().should.become("complete")
        .elementByCss('input[value=Submit]').click()

        // Log out
        .frame()
        .waitForElementById('dashboardPanel-body')
        .elementByLinkText('Logout').click();

});
