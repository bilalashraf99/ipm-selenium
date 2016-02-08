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

it("should click Search icon in My Widgets", function  () {
  return browser
      .waitForElementByCss('input#case_search').click();
});

it("should open Search popup under Reassign Case", function  () {
  return browser
      .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
      .elementByCss('#caseSearchDiv input#case_reassign').click()
      .waitForElementByCss('iframe#actionHandler')
      .frame('actionHandler')
      .waitForElementByCss('a img[title=Search]').click();
});

it("should reassign case", function  () {
  var mainWindow;
  return browser
      .windowHandle().then(function (handle) {
        mainWindow = handle;
      })
      .windowHandles().then(function (handles) {
        handles.forEach(function (handle) {
          if (handle !== mainWindow) {
            return browser.window(handle);
          }
        });
      })
      .waitForElementByLinkText('A').click()
      .waitForElementByXPath('//td[normalize-space(text()) = "AnalystUser2"]/parent::tr//input').click()
      .elementByCss('input[name=Add_Bt]').click().then(function() {
        return browser.window(mainWindow);
      })
      .frame('actionHandler')
      .elementByCss('input[value=Reassign]').click()
      .waitForElementByCss('div.x-window.x-message-box').text().should.eventually.include("Case Reassigned Succsefully to AnalystUser2")
      .elementByCss('div.x-window.x-message-box span.x-btn-button').click();
});

it("should log out", function  () {
  return browser
    .frame()
    .elementByLinkText('Logout').click();
});
