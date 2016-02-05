var common = require("../common");
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

it("should open Advanced Search", function  () {
  return browser
    .waitForElementByCss('input#advSearch').click();
});

it("should search based on Task Name", function  () {
  return browser
    .waitForElementByCss('select#selTaskName option[value=EnterDataAndReviewDocs]').click()
    .elementByCss('input[value=Search]').click()
    .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(3);
});

it("should search based on Case Owner Worker", function  () {
  return browser
    .elementByCss('input[value=Reset]').click()
    .elementByCss('select#selCaseOwner option[value=Analyst]').click()
    .elementByCss('input[value=Search]').click()
    .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should search based on Task Status", function  () {
  return browser
    .elementByCss('input[value=Reset]').click()
    .elementByCss('select#selStatus option[value=ASSIGNED]').click()
    .elementByCss('input[value=Search]').click()
    .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1)
});

it("should search based on Activity Type", function  () {
  return browser
    .elementByCss('input[value=Reset]').click()
    .elementByCss('select#selAppName option[value="15"]').click()
    .elementByCss('input[value=Search]').click()
    .elementByCssOrNull('div#SearchResults table[role=presentation] tr').should.eventually.be.null;
});

it("should search based on multiple values", function  () {
  return browser
    .elementByCss('select#selTaskName option[value=EnterDataAndReviewDocs]').click()
    .elementByCss('select#selCaseOwner option[value=AnalystUser1]').click()
    .elementByCss('select#selStatus option[value=COMPLETED]').click()
    .elementByCss('input#txtName').type("Willis Of New Hampshire Inc")
    .elementByCss('input#txtTaxId').type("020258767")
    .elementByCss('input[value=Search]').click()
    .elementByCssOrNull('div#SearchResults table[role=presentation] tr').should.eventually.be.null;
});

it("should clear Activity Type selection and search", function  () {
  return browser    
    .elementByCss('select#selAppName option[value=NO_SELECTION]').click()
    .elementByCss('input[value=Search]').click()
    .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1);
});

it("should log out", function  () {
  return browser
    .elementByLinkText('Logout').click();
});
