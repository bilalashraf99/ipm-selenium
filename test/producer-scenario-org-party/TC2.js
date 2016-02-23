var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Verify Tax ID", function() {

    function retry(maxRetries, fn) {
        return fn().catch(function(err) {
            if (maxRetries <= 0) {
                throw err;
            }
            console.log("Retrying... " + maxRetries + " retries left");
            return retry(maxRetries - 1, fn);
        });
    }

    var relog = function() {
        return browser
            .elementByLinkText('Logout').click()
            .sleep(5000)
            .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("020258767.username"))
            .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("020258767.password"))
            .elementByCss('form[name=loginForm] input[type=submit]').click()
            .frame('TaskShowFrame');
    };

    return browser
        // Load login page
        .get(url)

        // Log in as user '020258767'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("020258767.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("020258767.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Should cancel Tax ID verification
        .frame('TaskShowFrame')
        .catch(function() {
            return retry(10, relog);
        })
        .waitForElementByCss('input[value=Cancel]').click()
        .frame()

        // TODO: Bug redirects to localhost, line below is to make test pass
        .get(url)

        // Log in as user '020258767'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').clear().type(config.get("020258767.username"))
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
