var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Close Case.should load login page", function () {
    return browser
        .get(url);
});

it("Close Case.should log in as user 'AnalystUser1'", function () {
    return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
});

it("Close Case.should click Search icon in My Widgets", function () {
    return browser
        .waitForElementByCss('input#case_search').click();
});

it("Close Case.should cancel Close Case", function () {
    return browser
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#caseSearchDiv input#case_close').click()
        .waitForElementByCss('div.x-window.x-message-box')
        .elementByXPath('>', '//span[normalize-space(text())="No"]').click();
});

it("Close Case.should refresh and Close Case", function () {
    return browser
        .elementByCss('#searchCaseFiltersDiv input#case_search').click()
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#caseSearchDiv input#case_close').click()
        .waitForElementByCss('div.x-window.x-message-box')
        .elementByXPath('>', '//span[normalize-space(text())="Yes"]').click()
        .elementByCss('div.x-window.x-message-box')
        .elementByXPath('>', '//span[normalize-space(text())="OK"]').click();
});

it("Close Case.should refresh and verify closed case", function () {
    return browser
        .elementByCss('#searchCaseFiltersDiv input#case_search').click();
        // verify removed
});

it("Close Case.should log out", function () {
    return browser
        .frame()
        .elementByLinkText('Logout').click();
});
