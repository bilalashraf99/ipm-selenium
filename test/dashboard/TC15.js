var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("should load login page", function () {
  return browser
    .get(url);
});

it("should log in as user 'ManagerUser1'", function  () {
  return browser
    .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("manager.username"))
    .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("manager.password"))
    .elementByCss('form[name=loginForm] input[type=submit]').click();
});

it("should open Advanced Search", function  () {
  return browser
    .waitForElementByCss('input#case_advSearch').click();
});

it("should search based on Task Case", function  () {
  return browser
    .waitForElementByCss('#case_selTaskName option[value^="Willis Of New Hampshire Inc--020258767#"]').click()
    .elementByCss('#case_advSearchDiv input[value=Search]').click()
    .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should search based on Case Owner Worker", function  () {
  return browser
    .elementByCss('#case_advSearchDiv input[value=Reset]').click()
    .elementByCss('#case_selCaseOwner option[value=AnalystUser1]').click()
    .elementByCss('#case_advSearchDiv input[value=Search]').click()
    .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should search based on Task Status", function  () {
  return browser
    .elementByCss('#case_advSearchDiv input[value=Reset]').click()
    .elementByCss('#case_selStatus option[value=PI_REMOVED]').click()
    .elementByCss('#case_advSearchDiv input[value=Search]').click()
    .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should search based on multiple values", function  () {
  return browser
    .elementByCss('#case_advSearchDiv input[value=Reset]').click()
    .elementByCss('#case_selCaseOwner option[value=AnalystUser1]').click()
    .elementByCss('#case_selStatus option[value=PI_ACTIVATED]').click()
    .elementByCss('input#case_txtName').type("John")
    .elementByCss('input#case_txtTaxId').type("067600492")
    .elementByXPath('//input[@id="case_selectedFromDateSTask"]/following-sibling::a').click()
    .elementByXPath('//div[@class="calendar" and contains(@style,"display: block")]//div[normalize-space(text())="Today"]').click()
    .elementByXPath('//input[@id="case_selectedToDateSTask"]/following-sibling::a').click()
    .elementByXPath('//div[@class="calendar" and contains(@style,"display: block")]//td[contains(@class,"today")]/following::td[not(contains(@class,"wn"))]').click()
    .elementByCss('#case_advSearchDiv input[value=Search]').click()
    .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should log out", function  () {
  return browser
    .elementByLinkText('Logout').click();
});
