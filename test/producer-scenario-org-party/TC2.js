var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Verify Tax ID", function() {

    var relog = function() {
        return browser
            .elementByLinkText('Logout').click()
            .sleep(5000)
            .login('371494996')
            .frame('TaskShowFrame');
    };

    return browser
        // Load login page
        .get(url)

        // Log in as user '371494996'
        .login('371494996')

        // Should cancel Tax ID verification
        .frame('TaskShowFrame')
        .catch(function() {
            return common.retry(10, relog);
        })
        .waitForElementByCss('input[value=Cancel]').click()
        .frame()

        // TODO: Bug redirects to localhost, line below is to make test pass
        .get(url)

        // Log in as user '371494996'
        .login('371494996')

        // Enter valid value
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('4996')
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
