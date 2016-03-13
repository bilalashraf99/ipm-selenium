var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Send Email", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Click Search icon in My Widgets
        .waitForElementByCss('#myWidgetDiv input#case_search').click()

        // Open Send Adhoc Email popup and verify contents
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#caseSearchDiv input#case_email').click()
        .waitForElementByCss('iframe#actionHandler')
        .frame('actionHandler')
        .frame('adhocTask')
        .frame('AppShowFrame')
        .waitForElementByCss('#templateNames option[value="OnBoardingRejection.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingMissingDocNotification.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingCloseCase.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingDataEntry.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingAppUnderReview.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingCloseCaseDeclination.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingWelcome.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingDataEntryWithUserCredentials.docx"]').click()
        .elementByCss('input#letterKeySelected').getValue().should.become("OB_LK_0008")

        // Reset
        .elementByLinkText('Reset').click()
        .elementByCss('#templateNames option[value="-1"]').isSelected().should.eventually.be.true
        .elementByCss('input#letterKeySelected').getValue().should.eventually.be.empty
        .elementByCss('textarea#descriptionSelected').getValue().should.eventually.be.empty

        // Select 'OnBoardingRejection.docx' and Create
        .elementByCss('#templateNames option[value="OnBoardingRejection.docx"]').click()
        .elementByCss('input#letterKeySelected').getValue().should.become("OB_LK_0001")
        .elementByCss('input#createButton').click()

        // Verify tasks in 'My Worksteps'
        .frame()
        .elementByLinkText('My Worksteps').click()
        // Verify!

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
