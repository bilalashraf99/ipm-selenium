var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Verify Tax ID", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user '067600492'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("067600492.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("067600492.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Make first attempt to enter invalid Tax ID
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('1111')
        .elementByCss('form[name=form] input[type=submit]').click()
        .elementByCss('.x-message-box').text().should.eventually.include('2 more attempt')

        // Dismiss the popup message
        .waitForElementByLinkText('OK', 10000).click()

        // Make second attempt to enter invalid Tax ID
        .elementByCss('form[name=form] input[name=Tax_Id]').type('2222')
        .elementByCss('form[name=form] input[type=submit]').click()
        .elementByCss('.x-message-box').text().should.eventually.include('1 more attempt')

        // Dismiss the popup message
        .waitForElementByLinkText('OK', 10000).click()

        // Make third attempt to enter invalid Tax ID
        .elementByCss('form[name=form] input[name=Tax_Id]').type('3333')
        .elementByCss('form[name=form] input[type=submit]').click()
        .elementByCss('.x-message-box').text().should.eventually.include('Please contact the insurance company')

        // Dismiss the popup message
        .waitForElementByLinkText('OK', 10000).click()

        // Log out
        .waitForElementByLinkText('Logout').click()

        // Log in as user 'AnalystUser1'
        .frame()
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // THIS ROW DOES NOT EXIST
        // Click on new task among search results
        .waitForElementByXPath("//div[@id='SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/child::td/a", 10000)
        .click()

        // Select 'Continue OnBoarding?' and submit
        .frame('TaskShowFrame')
        .elementById('checkBox3').isSelected(function(err, res) { if (res == false) browser.elementById('checkBox3').click(); done(); })
        .elementById('createButton').click()
        .frame()
        .sleep(2000)

        // Log out
        .elementByLinkText('Logout').click()

        // Log in as user '067600492'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("067600492.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("067600492.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click Cancel
        .frame('TaskShowFrame')
        .waitForElementByLinkText('Cancel').click()
        .frame()

        // Log in as user '067600492'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("067600492.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("067600492.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Attempt to enter valid value
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
        .and.should.eventually.include("Appointment Requests")
        .frame();

});
