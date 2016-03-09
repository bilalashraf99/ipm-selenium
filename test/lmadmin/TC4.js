var common = require("../common");
var browser = common.browser;

it("Add letter key", function () {

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

        .elementById('letterKeyHeaderDiv').elementByLinkText('>', 'Add').click()

        .waitForElementById('addletterKeyTextBox').type("New_LetterKey")
        .elementById('addletterKeyDescriptionTextArea').type("New_LetterKey Description")
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "5"]/parent::tr//input').click()
        .elementByXPath('//table[@id="attachmentsForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "3"]/parent::tr//input').click()
        .elementByXPath('//table[@id="attachmentsForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "5"]/parent::tr//input').click()
        .elementByXPath('//input[@value="Disclosure1.txt"]//ancestor::tr/preceding-sibling::tr[2]//input').click()
        .elementById('bizsite_completeTask_COMPLETE_LABEL_id').click()

        // Approve
        .frame('TaskShowFrame')
        .waitForElementByCss('select option[value=Approve]').click()
        .elementByCss('textarea#textArea2').type("Approved by ebms")
        .elementById('bizsite_completeTask_COMPLETE_LABEL_id').click()
        .sleep(1000)

        // Click on Applications tab
        .frame()
        .waitForElementByLinkText('Applications', 10000).click()

        // Click on LMAdmin in Application Name column
        .waitForElementByLinkText('LMAdmin').click()

        // Click on Create button
        .frame('AppShowFrame')
        .waitForElementByCss('a#bizsite_completeTask_CREATE_LABEL_id').click()

        // Select OnBoarding from the dropdown
        .frame('TaskShowFrame')
        .waitForElementByCss('select#appNamesCombo option[value=OnBoarding]').click()

        // Select letter key and verify
        .waitForElementByXPath('//td[normalize-space(text())="New_LetterKey"]/parent::tr//input').click()
        .sleep(1000)
        .elementByCss('#addletterKeyTextBox').getValue().should.become("New_LetterKey")
        .elementByCss('#addletterKeyDescriptionTextArea').getValue().should.become("New_LetterKey Description")
        .elementByXPath('//table[@id="templatesForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "5"]/parent::tr//input').isSelected().should.eventually.be.true
        .elementByXPath('//table[@id="attachmentsForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "3"]/parent::tr//input').isSelected().should.eventually.be.true
        .elementByXPath('//table[@id="attachmentsForLetterKeyTable"]//tr/td[2][normalize-space(text()) = "5"]/parent::tr//input').isSelected().should.eventually.be.true
        .elementByXPath('//input[@value="Disclosure1.txt"]//ancestor::tr/preceding-sibling::tr[2]//input').isSelected().should.eventually.be.true

        // Click on Reset button
        .elementById('bizsite_reset_RESET_LABEL_id').click();

});