var common = require("../common");
var browser = common.browser;

it("View default letter templates, attachments and disclosures", function () {

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
        .waitForElementByXPath('//td[normalize-space(text())="OB_LK_0001"]/parent::tr//input').click()
        .sleep(2000)
        .waitForElementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "1"]')
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "3"]')
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "4"]')
        .elementByXPath('//table[@id="attachmentsForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "5"]')
        .elementByXPath('//table[@id="attachmentsForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "6"]')
        .elementByXPath('//table[@id="attachmentsForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "8"]')
        .elementByCss('#disclosureContentTableDiv input[value="Disclosure1.txt"]')
        .elementByCss('#disclosureContentTableDiv input[value="Disclosure4.txt"]')
        .elementByCss('#disclosureContentTableDiv input[value="Disclosure8.txt"]')

        // Select AddAppointment from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=AddAppointment]').click()

        // Select letter key and verify
        .waitForElementByXPath('//td[normalize-space(text())="ADD_AP_COMP_LK"]/parent::tr//input').click()
        .sleep(2000)
        .waitForElementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "10"]')
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "11"]')
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "12"]')

        // Select DisputeResolution from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=DisputeResolution]').click()

        // Select letter key and verify
        .waitForElementByXPath('//td[normalize-space(text())="DR_ACK"]/parent::tr//input').click()
        .sleep(2000)
        .waitForElementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "20"]')
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "21"]')
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "22"]')

        // Select HierarchyTransfer from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=HierarchyTransfer]').click()

        // Select letter key and verify
        .waitForElementByXPath('//td[normalize-space(text())="HT_LK_01"]/parent::tr//input').click()
        .sleep(2000)
        .waitForElementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "14"]')
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "15"]')
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "16"]')

        // Select Termination from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=Termination]').click()

        // Select letter key and verify
        .waitForElementByXPath('//td[normalize-space(text())="TERM_COMP_LK"]/parent::tr//input').click()
        .sleep(2000)
        .waitForElementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "17"]')
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "18"]')
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "19"]')

        // Select ExamMonitor from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=ExamMonitor]').click()

        // Select letter key and verify
        .waitForElementByXPath('//td[normalize-space(text())="EM_LK_001"]/parent::tr//input').click()
        .sleep(2000)
        .waitForElementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "23"]')

        // Select ContactPointManager from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=ContactPointManager]').click()

        // Select letter key and verify
        .waitForElementByXPath('//td[normalize-space(text())="CPM_LK"]/parent::tr//input').click()
        .sleep(2000)
        .waitForElementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "13"]')

        // Click on Reset button
        .elementById('bizsite_reset_RESET_LABEL_id').click();

});