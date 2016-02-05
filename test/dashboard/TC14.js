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

it("should search based on Case Name", function  () {
  return browser
    .waitForElementByCss('select#case_searchField option[value=CASE_NAME]').click()
    .elementByCss('select#case_OPERATOR option[value=LIKE]').click()
    .elementByCss('input#case_searchText').type('Willis')
    .elementByCss('input#case_search').click()
    .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should search based on Type", function  () {
  return browser
    .waitForElementByCss('select#case_searchField1 option[value=TYPE]').click()
    .elementByCss('select#case_OPERATOR1 option[value=IS]').click()
    .elementByCss('input#case_searchText1').clear().type('OnBoarding')
    .elementByCss('#case_basicSearchDiv input#case_search').click()
    .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(3);
});

it("should search based on Status", function  () {
  return browser
    .waitForElementByCss('select#case_searchField1 option[value=STATUS]').click()
    .elementByCss('select#case_OPERATOR1 option[value=NOT]').click()
    .elementByCss('input#case_searchText1').clear().type('PI_REMOVED')
    .elementByCss('#case_basicSearchDiv input#case_search').click()
    .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(2);
});

it("should search based on Tax ID", function  () {
  return browser
    .waitForElementByCss('select#case_searchField1 option[value=TAX_ID]').click()
    .elementByCss('select#case_OPERATOR1 option[value=LIKE]').click()
    .elementByCss('input#case_searchText1').clear().type('02')
    .elementByCss('#case_basicSearchDiv input#case_search').click()
    .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should search based on Name", function  () {
  return browser
    .waitForElementByCss('select#case_searchField1 option[value=NAME]').click()
    .elementByCss('select#case_OPERATOR1 option[value=NOT_LIKE]').click()
    .elementByCss('input#case_searchText1').clear().type('FR')
    .elementByCss('#case_basicSearchDiv input#case_search').click()
    .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(2);
});

it("should log out", function  () {
  return browser
    .elementByLinkText('Logout').click();
});
