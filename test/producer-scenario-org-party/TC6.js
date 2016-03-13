var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Enter data - View approver comments and modify data after Fix action", function() {

    return browser
        .get(url)

        // Log in as user '371494996'
        .login('371494996')

        // Enter valid value
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('4996')
        .elementByCss('form[name=form] input[type=submit]').click()

        // Expand all sections
        .frame('TaskShowFrame')
        .waitForElementByLinkText('Expand All').click()

        // Verify and update Errors and Omissions
        .elementById('errorsAndOmissionsRejectReason').text().should.become('AnalystUser1 : Rejected : Rejected by AnalystUser')
        .elementByCss('select#PolicyTypeDs option[value=Bond]').click()

        // Verify and update Payment Account section
        .elementById('paymentAccountsRejectReason').text().should.become('AnalystUser1 : Rejected : Rejected by AnalystUser')
        .elementByCss('#AccountHolderNameDs1').clear().type("National Benefits Group Llc Dba Greenway Financial")

        // Verify Basic Information, Contact Information, Continuing Education, Legal Questions, Appointment Requests sections
        .elementById('basicInfoRejectReason').text().should.become('AnalystUser1 : Accepted : Accepted by AnalystUser')
        .elementById('contactInformationRejectReason').text().should.become('AnalystUser1 : Accepted : Accepted by AnalystUser')
        .elementById('continuingEducationRejectReason').text().should.become('AnalystUser1 : Accepted : Accepted by AnalystUser')
        .elementById('legalQuestionsRejectReason').text().should.become('AnalystUser1 : Accepted : Accepted by AnalystUser')
        .elementById('appointmentRequestsRejectReason').text().should.become('AnalystUser1 : Accepted : Accepted by AnalystUser')

        // Verify approval comments
        .elementByCss('textarea[name=textArea1]').getValue().should.become('AnalystUser1 : Fix : Some sections are rejected by Analyst')

        // Click on Submit
        .elementByCss('input[value=Submit]').click()
        .sleep(5000)

        // Expand all sections
        .frame('TaskShowFrame')
        .waitForElementByLinkText('Expand All').click()

        // Verify Upload Documents
        .elementById('uploadDocumentsRejectReason').text().should.become('AnalystUser1 : Accepted : Accepted by AnalystUser')

        // Verify and update E-Sign Documents
        .elementById('eSignDocumentsRejectReason').text().should.become('AnalystUser1 : Rejected : Rejected by AnalystUser')
        .elementById('eSignDs').clear().type("National Benefits Group Llc Dba Greenway Financial")

        // Verify Approval Comments
        .elementByCss('textarea[name=textArea1]').getValue().should.become('AnalystUser1 : Fix : Some sections are rejected by Analyst')

        // Click on Submit
        .elementByCss('input[value=Submit]').click()

        // Verify
        .frame()
        .waitForElementByCss('div#resultDiv', 10000).text()
        .should.eventually.include("Thank you for completing your application. It will now be reviewed internally.")

        // Log out
        .elementByLinkText('Logout').click();

});
