var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Enter data - View approver comments and modify data after Fix action", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user '067600492'
        .waitForElementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("067600492.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("067600492.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Attempt to enter valid value
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('0492')
        .elementByCss('form[name=form] input[type=submit]').click()

        // Expand all sections
        .frame('TaskShowFrame')
        .elementByLinkText('Expand All').click()
        .elementById('basicInfoRejectReason').text().should.become('AnalystUser1 : Rejected : Rejected by AnalystUser')
        .elementById('contactInformationRejectReason').text().should.become('AnalystUser1 : Rejected : Rejected by AnalystUser')
        .elementById('errorsAndOmissionsRejectReason').text().should.become('AnalystUser1 : Accepted : Accepted by AnalystUser')
        .elementById('legalQuestionsRejectReason').text().should.become('AnalystUser1 : Accepted : Accepted by AnalystUser')
        .elementByCss('textarea[name=textArea1]').getValue().should.become('AnalystUser1 : Fix : Some sections are rejected by Analyst')

        // Click on Submit
        .elementByCss('input[value=Submit]').click()

        // FIXME: Upload Document and E-Sign Documents section missing!
    
        // Click on Submit
        .waitForElementByCss('div#resultDiv', 10000).text()
        .should.eventually.include("Thank you for completing your application. It will now be reviewed internally.")

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
