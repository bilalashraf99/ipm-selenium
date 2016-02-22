var common = require("../common");
var path = require("path");
var browser = common.browser;

it("Upload Documents and ESignature - Person party", function () {

    return browser
        // Click Show Task button
        .frame()
        .elementByLinkText('Show Task').click()

        // Open Upload Document section, upload W-9 file
        .frame('TaskShowFrame')
        .waitForElementById('uploadDocumentsHeader').click()
        .waitForElementByXPath('//div[@id="RequiredDocNamesDiv"]//td[normalize-space(text())="W-9"]/parent::tr/td/input').click()
        .waitForElementByCss('input#uploadFilesID').sendKeys(path.join(__dirname, "../../files", "AppUnderReview.docx"))
        .elementByCss('form#uploadFile input[value=Upload]').click()
        .waitForElementByLinkText('AppUnderReview.docx')

        // Upload Proof of E & O file
        .waitForElementByXPath('//div[@id="RequiredDocNamesDiv"]//td[normalize-space(text())="Proof of E & O"]/parent::tr/td/input').click()
        .waitForElementByCss('input#uploadFilesID').sendKeys(path.join(__dirname, "../../files", "CloseCase.docx"))
        .elementByCss('form#uploadFile input[value=Upload]').click()
        .waitForElementByLinkText('CloseCase.docx')

        // Upload License file
        .waitForElementByXPath('//div[@id="RequiredDocNamesDiv"]//td[normalize-space(text())="License"]/parent::tr/td/input').click()
        .waitForElementByCss('input#uploadFilesID').sendKeys(path.join(__dirname, "../../files", "CloseCaseDeclination.docx"))
        .elementByCss('form#uploadFile input[value=Upload]').click()
        .waitForElementByLinkText('CloseCaseDeclination.docx')

        // Upload Direct Deposit file
        .waitForElementByXPath('//div[@id="RequiredDocNamesDiv"]//td[normalize-space(text())="Direct Deposit"]/parent::tr/td/input').click()
        .waitForElementByCss('input#uploadFilesID').sendKeys(path.join(__dirname, "../../files", "DataEntry.docx"))
        .elementByCss('form#uploadFile input[value=Upload]').click()
        .waitForElementByLinkText('DataEntry.docx')

        // Open E-Sign Documents section and fill data
        .elementById('eSignDocumentsHeader').click()
        .elementsByCss('#eSignDocumentsContentDiv input[type=checkbox]').then(common.clickAll)
        .elementByCss('input#eSignDs').type("John Blumberg")

        // Click on Submit button
        .elementByCss('input[value=Submit]').click().sleep(5000);

});
