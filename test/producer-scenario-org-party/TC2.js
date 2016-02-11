var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Verify Tax ID", function() {

    return browser
        // Load login page
        .get(url)

        // Log in as user '020258767'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("020258767.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("020258767.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Should cancel Tax ID verification
        .frame('TaskShowFrame')
        .waitForElementByCss('input[value=Cancel]').click()

        // Log in as user '020258767'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("020258767.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("020258767.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Enter valid value
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('8767')
        .elementByCss('form[name=form] input[type=submit]').click()
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form]').text().should.eventually.include("Welcome to Aurea's Agent OnBoarding Process")
        .and.should.eventually.include("Basic Information")
        .and.should.eventually.include("Contact Information")
        .and.should.eventually.include("Errors and Omissions")
        .and.should.eventually.include("Payment Accounts")
        .and.should.eventually.include("Continuing Education")
        .and.should.eventually.include("Legal Questions")
        .and.should.eventually.include("Appointment Requests");

});
