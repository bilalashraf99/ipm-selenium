var common = require("../common");
var browser = common.browser;


it("Upload documents", function () {

    return browser
        // Click Upload Documents section header
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementById('uploadDocumentsHeader').click()

        // Upload W-9
        .elementByXPath('//td[normalize-space(text())="W-9"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/AppUnderReview.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click()

        // Upload Proof of E & O
        .elementByXPath('//td[normalize-space(text())="Proof of E & O"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/CloseCase.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click()

        // Upload License
        .elementByXPath('//td[normalize-space(text())="License"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/CloseCaseDeclination.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click()

        // Upload Direct Deposit
        .elementByXPath('//td[normalize-space(text())="Direct Deposit"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/DataEntry.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click()

        // Click E-Sign Documents section header
        .elementById('eSignDocumentsHeader').click()

        // Select checkboxes
        .elementsByCss('input[name=eSignDocCheckbox]').then(common.clickAll)

        // Sign and click Submit
        .elementByCss('input#eSignDs').type("Fred Sellers")
        .elementByLinkText('Collapse All').click()
        // TODO:Sign button?
        .elementByCss('input[value=Submit]').click()
        .sleep(5000)

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
