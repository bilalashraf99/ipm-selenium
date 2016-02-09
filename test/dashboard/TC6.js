var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Close Case", function() {

    // Load login page
    var step1 = browser
        .get(url);

    // Log in as user 'AnalystUser1'
    var step2 = step1
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();

    // Click Search icon in My Widgets
    var step3 = step2
        .waitForElementByCss('select#case_searchField option[value=NAME]').click()
        .elementByCss('input#case_searchText').type("John Blumberg")
        //.elementByCss('input#case_searchText').type("ALAN IRVING")
        .elementByCss('input#case_search').click();

    // Cancel Close Case
    var step4 = step3
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#caseSearchDiv input#case_close').click()
        .waitForElementByCss('div.x-window.x-message-box')
        .elementByXPath('>', '//span[normalize-space(text())="No"]').click();

    // Refresh and Close Case
    var step5 = step4
        .elementByCss('#searchCaseFiltersDiv input#case_search').click()
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#caseSearchDiv input#case_close').click()
        .waitForElementByCss('div.x-window.x-message-box')
        .elementByXPath('>', '//span[normalize-space(text())="Yes"]').click()
        .sleep(200)
        .elementByCss('div.x-window.x-message-box')
        .elementByXPath('>', '//span[normalize-space(text())="OK"]/parent::span').click();

    // Refresh and verify closed case
    var step6 = step5
        .elementByCss('#searchCaseFiltersDiv input#case_search').click();
        // verify removed

    // Should log out
    return step6
        .frame()
        .elementByLinkText('Logout').click();

});