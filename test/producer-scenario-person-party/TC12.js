var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Approval - Approve action", function () {

    var approvalXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/descendant::a[normalize-space(text())='Approval']";

    var approvalNested = function(e) {
        return browser
            .waitForElementByCss('#SearchResults a[data-qtip="Next Page"]:not(.x-btn-disabled)').then(function(ref){
                return ref.click()
                    .waitForElementByXPath(approvalXPath)
                    .catch(nested);
            });
    };

    var uplineXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/descendant::a[normalize-space(text())='Select Upline']";

    var uplineNested = function(e) {
        return browser
            .waitForElementByCss('#SearchResults a[data-qtip="Next Page"]:not(.x-btn-disabled)').then(function(ref){
                return ref.click()
                    .waitForElementByXPath(approvalXPath)
                    .catch(nested);
            });
    };

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .waitForElementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click on Approval task among search results
        .waitForElementByCss('select#searchField option[value=TAX_ID]', 5000).catch(function(e) {
            console.log(e);
            return browser.sleep(1000).waitForElementByCss('select#searchField');
        }).click()
        .elementByCss('input#searchText').type('067600492')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(approvalXPath)
        .catch(approvalNested).click()

        // Verify updated Preferred Name
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementByCss('input[name=textField7]').getValue().should.become('Blumberg')

        // Click on Approve
        .waitForElementByCss('input[value=Approve]').click()
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementById('midPanelHeader').text().should.eventually.include("Select Up-line")

        // Log out
        .frame()
        .elementByLinkText('Logout').click()

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click on new Upline task among search results
        .waitForElementByCss('select#searchField option[value=TAX_ID]', 5000).catch(function(e) {
            console.log(e);
            return browser.sleep(1000).waitForElementByCss('select#searchField');
        }).click()
        .elementByCss('input#searchText').type('067600492')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(uplineXPath)
        .catch(uplineNested).click()

        // Verify Select Up-line page
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementById('midPanelHeader').text().should.eventually.include("Select Up-line");

});
