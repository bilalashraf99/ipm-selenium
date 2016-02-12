var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Enter data - Expand, Collapse and Validate sections", function () {

    return browser
        // Expand all sections
        .frame('TaskShowFrame')
        .elementByLinkText('Expand All').click()
        // All sections should be expanded
        .waitForElementByCss('#basicInfoContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#contactInformationContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#errorsAndOmissionsContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#paymentAccountsContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#continuingEducationContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#legalQuestionsContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#appointmentRequestsContentDiv').isDisplayed().should.eventually.be.true
        // Only Basic Information, Contact Information and Continuing Education should be marked complete
        .elementByCss('#basicInfoHeaderStatus.completedSection')
        .elementByCss('#contactInformationHeaderStatus.completedSection')
        .elementByCss('#errorsAndOmissionsHeaderStatus.incompleteSection')
        .elementByCss('#paymentAccountsHeaderStatus.incompleteSection')
        .elementByCss('#continuingEducationHeaderStatus.completedSection')
        .elementByCss('#legalQuestionsHeaderStatus.incompleteSection')
        .elementByCss('#appointmentRequestsHeaderStatus.incompleteSection')
        // Left hand side panel
        .elementByCss('#headerLeftAndNavigationSummary').text().should.eventually.include("3 of 7 steps")

        // Collapse all sections
        .elementByLinkText('Collapse All').click()
        .waitForElementById('basicInfoContentDiv').isDisplayed().should.eventually.be.false
        .elementById('contactInformationContentDiv').isDisplayed().should.eventually.be.false
        .elementById('errorsAndOmissionsContentDiv').isDisplayed().should.eventually.be.false
        .elementById('paymentAccountsContentDiv').isDisplayed().should.eventually.be.false
        .elementById('continuingEducationContentDiv').isDisplayed().should.eventually.be.false
        .elementById('legalQuestionsContentDiv').isDisplayed().should.eventually.be.false
        .elementById('appointmentRequestsContentDiv').isDisplayed().should.eventually.be.false

        // Click Show Task button
        .frame()
        .elementByXPath('//span[normalize-space(text())="Show Task"]').click()

        // Click Basic Information text in the left hand side panel
        .frame('TaskShowFrame')
        .elementById('basicInfoNavLink').click()
        .elementByCss('#basicInfoContentDiv').isDisplayed().should.eventually.be.true
        .elementById('FirstNameDs').getValue().should.become('John')
        .elementByCss('#LastNameDsTextBoxDiv input').getValue().should.become('Blumberg')

        // Click Contact Information text in the left hand side panel
        .elementById('contactInformationNavLink').click()
        .elementByCss('#contactInformationContentDiv').isDisplayed().should.eventually.be.true
        .waitForElementById('Street1Ds1').getValue().should.eventually.not.be.empty
        .elementById('CityDs1').getValue().should.eventually.not.be.empty
        .elementById('EmailDs1').getValue().should.become('solnsengg@gmail.com')

        // Click Errors and Omissions text in the left hand side panel
        .elementById('errorsAndOmissionsNavLink').click()
        .elementByCss('#errorsAndOmissionsContentDiv').isDisplayed().should.eventually.be.true
        .waitForElementByXPath('//div[@id="errorsAndOmissionsContentDiv"]//td[normalize-space(text())="Tax ID :"]' +
        '/following-sibling::td[1]//input[@readonly]')
        .getValue().should.become('067600492')

        // Click Payment Accounts text in the left hand side panel
        .elementById('paymentAccountsNavLink').click()
        .elementByCss('#paymentAccountsContentDiv').isDisplayed().should.eventually.be.true
        .waitForElementById('AccountTypeDs1').getValue().should.become('DefaultPayment')
        .elementById('PaymentTypeDs1').getValue().should.become('W2')

        // Click Continuing Education text in the left hand side panel
        .elementById('continuingEducationNavLink').click()
        .elementByCss('#continuingEducationContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#continuingEducationContentDiv #coursesName0')
        .elementByCss('#continuingEducationContentDiv #coursesName1')
        .elementByCss('#continuingEducationContentDiv #coursesName2')

        // Click Legal Questions text in the left hand side panel
        .elementById('legalQuestionsNavLink').click()
        .elementByCss('#legalQuestionsContentDiv').isDisplayed().should.eventually.be.true
        .waitForElementsByCss('#legalQuestionsContentDivTable tr:not([height])')
        .should.eventually.have.length(10)

        // Click Appointment Requests text in the left hand side panel
        .elementById('appointmentRequestsNavLink').click()
        .elementByCss('#appointmentRequestsContentDiv').isDisplayed().should.eventually.be.true;

});
