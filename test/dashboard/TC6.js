var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Close Case", function() {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Click Search icon in My Widgets
        .waitForElementByCss('select#case_searchField option[value=NAME]').click()
        .elementByCss('input#case_searchText').type("Fred Sellers")
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