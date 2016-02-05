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
  
it("should add notes for Activated case under My Widgets", function  () {
  return browser
    .waitForElementByCss('input#case_search').click()
    .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
    .elementByCss('#caseSearchDiv input#case_note').click()
    .waitForElementByCss('iframe#actionHandler')
    .frame('actionHandler')
    .waitForElementByCss('textarea#addNote').type("notes by analystUser1")
    .elementByCss('input[type=button][value=Add]').click()
    .elementByCss('div#noteDiv').text().should.eventually.include("notes by analystUser1");
});

it("should close popup and log out", function  () {
  return browser
    .elementByCss('input[value=Close]').click()
    .frame()
    .elementByLinkText('Logout').click();
});
 
it("should log in as user 'ManagerUser1'", function  () {
  return browser
    .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("manager.username"))
    .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("manager.password"))
    .elementByCss('form[name=loginForm] input[type=submit]').click();
});

it("should click Search icon in My Widgets", function  () {
  return browser
    .waitForElementByCss('input#case_search').click();
});

it("should verify notes for Activated case under My Widgets", function  () {
  return browser
    .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()    
    .elementByCss('#caseSearchDiv input#case_note').click()
    .waitForElementByCss('iframe#actionHandler')
    .frame('actionHandler')
    .waitForElementByCss('div#noteDiv').text().should.eventually.include("notes by analystUser1");
});

it("should add notes as ManagerUser1", function  () {
  return browser
    .elementByCss('textarea#addNote').type("notes by managerUser1")
    .elementByCss('input[type=button][value=Add]').click()
    .elementByCss('div#noteDiv').text().should.eventually.include("notes by analystUser1")
    .and.should.eventually.include("notes by managerUser1");
});

it("should close popup", function  () {
  return browser
    .elementByCss('input[value=Close]').click()
});

it("should log out", function  () {
  return browser
    .frame()
    .elementByLinkText('Logout').click();
});
