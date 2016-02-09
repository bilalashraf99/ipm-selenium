var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Verify Tax ID", function() {

    // Load login page
    var step1 = browser
        .get(url);

    // Log in as user '020258767'
    var step2 = step1
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("020258767.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("020258767.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();

    // Should cancel Tax ID verification
    var step3 = step2
        .frame('TaskShowFrame')
        .waitForElementByCss('input[value=Cancel]').click();

    // Log in as user '020258767'
    var step4 = step3
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("020258767.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("020258767.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();

    // Enter valid value
    var step5 = step4
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('0492')
        .elementByCss('form[name=form] input[type=submit]').click()
        .waitForElementByCss('form[name=form]').text().should.eventually.include("Welcome to Aurea's Agent OnBoarding Process")
        .and.should.eventually.include("Basic Information")
        .and.should.eventually.include("Contact Information")
        .and.should.eventually.include("Errors and Omissions")
        .and.should.eventually.include("Payment Accounts")
        .and.should.eventually.include("Continuing Education")
        .and.should.eventually.include("Legal Questions")
        .and.should.eventually.include("Appointment Requests");

    // Log out
    return step5
        .frame()
        .elementByLinkText('Logout').click();

});
