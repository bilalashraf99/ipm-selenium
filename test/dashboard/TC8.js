var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("View / Edit Notes", function () {

    // Load login page
    var step1 = browser
        .get(url);

    // Log in as user 'AnalystUser1'
    var step2 = step1
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();

    // Add notes for Activated case under My Widgets
    var step3 = step2
        .waitForElementByCss('select#case_searchField option[value=NAME]').click()
        .elementByCss('input#case_searchText').type("John Blumberg")
        .waitForElementByCss('input#case_search').click()
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#caseSearchDiv input#case_note').click()
        .waitForElementByCss('iframe#actionHandler')
        .frame('actionHandler')
        .waitForElementByCss('textarea#addNote').type("notes by analystUser1")
        .elementByCss('input[type=button][value=Add]').click()
        .sleep(500)
        .elementByCss('div#noteDiv').text().should.eventually.include("notes by analystUser1");

    // Close popup and log out
    var step4 = step3
        .elementByCss('input[value=Close]').click()
        .frame()
        .elementByLinkText('Logout').click();

    // Log in as user 'ManagerUser1'
    var step5 = step4
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("manager.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("manager.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();

    // Click Search icon in My Widgets
    var step6 = step5
        .waitForElementByCss('select#case_searchField option[value=NAME]').click()
        .elementByCss('input#case_searchText').type("John Blumberg")
        .waitForElementByCss('input#case_search').click();

    // Verify notes for Activated case under My Widgets
    var step7 = step6
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#caseSearchDiv input#case_note').click()
        .waitForElementByCss('iframe#actionHandler')
        .frame('actionHandler')
        .waitForElementByCss('div#noteDiv').text().should.eventually.include("notes by analystUser1");

    // Add notes as ManagerUser1
    var step8 = step7
        .elementByCss('textarea#addNote').type("notes by managerUser1")
        .elementByCss('input[type=button][value=Add]').click()
        .sleep(500)
        .elementByCss('div#noteDiv').text().should.eventually.include("notes by analystUser1")
        .and.should.eventually.include("notes by managerUser1")
        .elementByCss('input[value=Close]').click();

    // Log out
    return step8
        .frame()
        .elementByLinkText('Logout').click();

});