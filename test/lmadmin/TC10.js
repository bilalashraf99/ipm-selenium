var common = require("../common");
var path = require("path");
var browser = common.browser;

it("Add letter attachment", function () {

    var xPath = '//table[@role="presentation"]//a[starts-with(normalize-space(text()), "Specify Letter Details")]';

    return browser
        // Click on My Tasks tab
        .frame()
        .waitForElementByLinkText('My Tasks').click()

        // Click on "Specify Letter Details" column
        .waitForElementByXPath(xPath).click()

        // Select DisputeResolution from the dropdown and verify
        .frame('TaskShowFrame')
        .waitForElementByCss('select#appNamesCombo option[value=DisputeResolution]').click()

        // Select letter key and verify
        .waitForElementByXPath('//td[normalize-space(text())="DR_LK_0001"]/parent::tr//input', 10000).click()
        .waitForElementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "20"]/parent::tr//input', 5000).click()
        .elementById('attachmentHeaderDiv').elementByLinkText('>', 'Add').click()
        .sleep(500)
        .elementByCss('.x-window.x-message-box').elementByLinkText('>', 'OK').click()

        // Click Add button
        .elementByCss('#LetterAttachment button').click()

        // Upload file and click on Complete
        .waitForElementById('uploadFilesID').sendKeys(path.join(__dirname, "../../files", "CPMNotification.docx"))
        .elementByCss('input[value=Upload]').click()
        .elementById('bizsite_completeTask_COMPLETE_LABEL_id').click()

        // Approve
        .frame('TaskShowFrame')
        .waitForElementByCss('select option[value=Approve]').click()
        .elementByCss('textarea#textArea2').type("Approved by ebms")
        .elementById('bizsite_completeTask_COMPLETE_LABEL_id').click()

        // Click on "View Feedback" link in My Tasks list
        .frame()
        .waitForElementByXPath('//table[@role="presentation"]//a[starts-with(normalize-space(text()), "View Feedback")]').click()

        // Click Complete
        .frame('TaskShowFrame')
        .elementById('bizsite_completeTask_COMPLETE_LABEL_id').click()
        .sleep(2000)

        // Click on Applications tab
        .frame()
        .waitForElementByLinkText('Applications', 10000).click()

        // Click on LMAdmin in Application Name column
        .waitForElementByLinkText('LMAdmin').click()

        // Click on Create button
        .frame('AppShowFrame')
        .waitForElementByCss('a#bizsite_completeTask_CREATE_LABEL_id').click()

        // Verify new attachment
        .frame('TaskShowFrame')
        .waitForElementByCss('select#appNamesCombo option[value=DisputeResolution]').click()
        .waitForElementByXPath('//td[normalize-space(text())="DR_LK_0001"]/parent::tr//input').click()
        .waitForElementById('attachmentsForLetterKeyTable', 10000).text().should.eventually.include("CPMNotification.docx")

        // Click on Reset button
        .elementById('bizsite_reset_RESET_LABEL_id').click();
});