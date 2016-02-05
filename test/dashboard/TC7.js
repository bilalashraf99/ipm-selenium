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

it("should select radio button for John Blumberg under My Widgets", function  () {
  return browser
    .waitForElementByXPath('//*[@id="case_SearchResultsDefault"]//td/div[normalize-space(text())="John Blumberg"]/parent::td/preceding-sibling::td//input').click()
    .elementByCss('input#case_document').click()
    .waitForElementByCss('fieldset#BCReport a').text().should.become("BCReport_Jan152013.docx")
    .waitForElementByCss('fieldset#ReloadDocs a').text().should.become("W9.pdf")
    .waitForElementByCss('fieldset#ESignDocs').text().should.eventually.include("CAAgreementAmendment.pdf")
    .and.should.eventually.include("GeneralAgreement.pdf");
});

it("should upload in RequiredDocs section", function  () {
  return browser
    .elementByCss('fieldset#RequiredDocs button[name=addNew]').click()
    .waitForElementByCss('input#uploadFilesID').sendKeys(__dirname + "/files/Welcome.docx")
    .elementByCss('input[value=Upload]').click()
    .waitForElementByCss('fieldset#RequiredDocs a').text().should.become("Welcome.docx")
    .elementByCss('img.x-tool-close').click();
});
 
it("should select radio button for row where status is Activated and delete W-9", function  () {
  return browser
    .waitForElementByXPath('//*[@id="case_SearchResultsDefault"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
    .elementByCss('input#case_document').click()
    .waitForElementByCss('fieldset#RequiredDocs a').text().should.become("Welcome.docx") //?
    // TODO: Delete button should be clicked, but there is no Delete button!
    .elementByCss('img.x-tool-close').click();
});

it("should select radio button for row where status is Activated and verify deletion", function  () {
  return browser
    .waitForElementByXPath('//*[@id="case_SearchResultsDefault"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
    .elementByCss('input#case_document').click()
    .waitForElementByCss('fieldset#ReloadDocs').text().should.eventually.not.include("W9.pdf")
    .elementByCss('img.x-tool-close').click();
});

it("should log out", function  () {
  return browser
    .elementByLinkText('Logout').click();
});
