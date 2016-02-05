var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("should load login page", function () {
  return browser
    .get(url);
});

it("should log in as user 'AnalystUser1'", function  () {
  return browser
    .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
    .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
    .elementByCss('form[name=loginForm] input[type=submit]').click();
});

it("should search based on Task Name", function  () {
  return browser
    .waitForElementByCss('select#searchField option[value=TASK_NAME]').click()
    .elementByCss('input#searchText').type('Review')
    .elementByCss('input#search').click()
    .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(4);
});

it("should search based on Type", function  () {
  return browser
    .waitForElementByCss('select#searchField option[value=TYPE]').click()
    .elementByCss('input#searchText').clear().type('LetterManager')
    .elementByCss('input#search').click()
    .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should search based on Status", function  () {
  return browser
    .waitForElementByCss('select#searchField option[value=STATUS]').click()
    .elementByCss('input#searchText').clear().type('ASSIGNED')
    .elementByCss('input#search').click()
    .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should search based on Tax ID", function  () {
  return browser
    .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
    .elementByCss('input#searchText').clear().type('067600492')
    .elementByCss('input#search').click()
    .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should search based on Name", function  () {
  return browser
    .waitForElementByCss('select#searchField option[value=NAME]').click()
    .elementByCss('input#searchText').clear().type('John')
    .elementByCss('input#search').click()
    .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should click on Dashboard tab", function  () {
  return browser
    .frame()
    .elementByLinkText('Dashboard', 10000).click();
});

it("should log out", function  () {
  return browser
    .elementByLinkText('Logout').click();
});
