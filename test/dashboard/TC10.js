var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("should load login page", function () {
    return browser
        .get(url);
});

it("should log in as user 'AnalystUser1'", function () {
    return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
});

it("should click Search icon in My Widgets", function () {
    return browser
        .waitForElementByCss('input#case_search').click();
});

it("should open Send Adhoc Email popup and verify contents", function () {
    return browser
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#caseSearchDiv input#case_email').click()
        .waitForElementByCss('iframe#actionHandler')
        .frame('actionHandler')
        .frame('adhocTask')
        .frame('AppShowFrame')
        .elementByCss('#templateNames option[value="OnBoardingRejection.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingMissingDocNotification.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingCloseCase.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingDataEntry.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingAppUnderReview.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingCloseCaseDeclination.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingWelcome.docx"]')
        .elementByCss('#templateNames option[value="OnBoardingDataEntryWithUserCredentials.docx"]').click()
        .elementByCss('input#letterKeySelected').getValue().should.become("OB_LK_0008");
});

it("should Reset", function () {
    return browser
        .elementByLinkText('Reset').click()
        .elementByCss('#templateNames option[value="-1"]').isSelected().should.eventually.be.true
        .elementByCss('input#letterKeySelected').getValue().should.eventually.be.empty
        .elementByCss('textarea#descriptionSelected').getValue().should.eventually.be.empty;
});

it("should select 'OnBoardingRejection.docx' and Create", function () {
    return browser
        .elementByCss('#templateNames option[value="OnBoardingRejection.docx"]').click()
        .elementByCss('input#letterKeySelected').getValue().should.become("OB_LK_0001")
        .elementByCss('input#createButton').click();
});

it("verify tasks in 'My Worksteps'", function () {
    return browser
        .frame()
        .elementByLinkText('My Worksteps').click();
    // Verify
});

it("should log out", function () {
    return browser
        .frame()
        .elementByLinkText('Logout').click();
});
