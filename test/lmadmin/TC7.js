var common = require("../common");
var path = require("path");
var browser = common.browser;

it("Add letter template", function () {

    var xPath = '//table[@role="presentation"]//a[starts-with(normalize-space(text()), "Specify Letter Details")]';

    return browser
        // Click on My Tasks tab
        .frame()
        .waitForElementByLinkText('My Tasks').click()

        // Click on "Specify Letter Details" column
        .waitForElementByXPath(xPath).click()

        // Select OnBoarding from the dropdown and verify
        .frame('TaskShowFrame')
        .waitForElementByCss('select#appNamesCombo option[value=OnBoarding]').click()

        // Select letter key and verify
        .waitForElementByXPath('//td[normalize-space(text())="New_LetterKey"]/parent::tr//input', 10000).click()
        .elementById('templateHeaderDiv').elementByLinkText('>', '+ Add').click()
        .sleep(500)
        .elementByCss('.x-window.x-message-box').elementByLinkText('>', 'OK').click()

        // Fill values and click Add button
        .elementByCss('#templateDeliveryTypeAndEmailSubjectLineFieldSet select option[value=Email]').click()
        .elementByCss('#templateDeliveryTypeAndEmailSubjectLineFieldSet input').type("Subject for new template notification")
        .elementByCss('#LetterTemplate button').click()

        // Upload file and click on Complete
        .waitForElementById('uploadFilesID').sendKeys(path.join(__dirname, "../../files", "AddAPCompletionNotification.docx"))
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

        // Verify new template
        .frame('TaskShowFrame')
        .waitForElementByCss('select#appNamesCombo option[value=OnBoarding]').click()
        .waitForElementByXPath('//td[normalize-space(text())="New_LetterKey"]/parent::tr//input').click()
        .waitForElementById('templatesForLetterKeyTable', 10000).text().should.eventually.include("AddAPCompletionNotification.docx")

        // Click on Reset button
        .elementById('bizsite_reset_RESET_LABEL_id').click();

});