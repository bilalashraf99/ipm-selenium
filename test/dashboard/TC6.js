var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Close Case", function() {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click Search icon in My Widgets
        .waitForElementByCss('select#case_searchField option[value=NAME]').click()
        .elementByCss('input#case_searchText').type("John Blumberg")
        //.elementByCss('input#case_searchText').type("ALAN IRVING")
        .elementByCss('input#case_search').click()

        // Cancel Close Case
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#caseSearchDiv input#case_close').click()
        .waitForElementByCss('div.x-window.x-message-box')
        .elementByXPath('>', '//span[normalize-space(text())="No"]').click()

        // Refresh and Close Case
        .elementByCss('#searchCaseFiltersDiv input#case_search').click()
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#caseSearchDiv input#case_close').click()
        .waitForElementByCss('div.x-window.x-message-box')
        .elementByXPath('>', '//span[normalize-space(text())="Yes"]').click()
        .sleep(200)
        .elementByCss('div.x-window.x-message-box')
        .elementByXPath('>', '//span[normalize-space(text())="OK"]/parent::span').click()

        // Refresh and verify closed case
        .elementByCss('#searchCaseFiltersDiv input#case_search').click()
        // verify removed

        // Should log out
        .frame()
        .elementByLinkText('Logout').click();

});