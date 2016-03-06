var common = require("../common");
var browser = common.browser;

it("Add disclosure", function () {

    var xPath = '//table[@role="presentation"]//a[starts-with(normalize-space(text()), "Specify Letter Details")]';

    return browser
        // Click on My Tasks tab
        .frame()
        .waitForElementByLinkText('My Tasks').click()

        // Click on "Specify Letter Details" column
        .waitForElementByXPath(xPath).click()

        // Select DisputeResolution from the dropdown and verify
        .frame('TaskShowFrame')
        .waitForElementByCss('select#appNamesCombo option[value=OnBoarding]').click()

        // Select letter key and verify
        .waitForElementByXPath('//td[normalize-space(text())="OB_LK_0001"]/parent::tr//input', 10000).click()
        .elementById('disclosureHeaderDiv').elementByLinkText('>', '+ Add').click()

        // Fill values and click Complete
        .waitForElementByCss('input[name=disclosureName]').type("NewDisclosure")
        .elementByCss('input[name=disclosureDescription]').type("This is NewDisclosure")
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

        // Verify new disclosure
        .frame('TaskShowFrame')
        .waitForElementByCss('select#appNamesCombo option[value=OnBoarding]').click()
        .waitForElementByXPath('//td[normalize-space(text())="OB_LK_0001"]/parent::tr//input').click()
        .sleep(2000)
        .elementByCss('#disclosureContentTableDiv input[value="NewDisclosure"]')

        // Click on Reset button
        .elementById('bizsite_reset_RESET_LABEL_id').click()

        // Should log out
        .frame()
        .elementByLinkText('Logout').click();
});