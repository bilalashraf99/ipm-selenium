var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Upload documents", function () {

    var clickAll = function(elements) {
        var result = [];
        for (var i = 0; i < elements.length; i++) {
            result.push(elements[i].click());
        }
        return Promise.all(result);
    };

    return browser
        // Click Upload Documents section header
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementById('uploadDocumentsHeader').click()

        // Upload W-9
        .elementByXPath('//td[normalize-space(text())="W-9"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/test.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click()

        // Upload Proof of E & O
        .elementByXPath('//td[normalize-space(text())="Proof of E & O"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/test.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click()

        // Upload License
        .elementByXPath('//td[normalize-space(text())="License"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/test.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click()

        // Upload Direct Deposit
        .elementByXPath('//td[normalize-space(text())="Direct Deposit"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/test.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click()

        // Click E-Sign Documents section header
        .elementById('eSignDocumentsHeader').click()

        // Select checkboxes
        .elementsByCss('input[name=eSignDocCheckbox]').then(clickAll)

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
