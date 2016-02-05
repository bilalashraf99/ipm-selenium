var config = require('nconf');
config.file({file: './test/config.json'});

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

var url = config.get("ipm.url");

describe("Dashboard", function() {
  this.timeout(30000);
  
  var browser;
   
  before(function () {
    // enables chai assertion chaining
    chaiAsPromised.transferPromiseness = wd.transferPromiseness;
    
    browser = wd.promiseChainRemote(config.get("remote")); 

    // optional extra logging
    browser.on('status', function(info) {
      console.log(info);
    });
    browser.on('command', function(meth, path, data) {
      console.log(' > ' + meth, path, data || '');
    });

    return browser
      .init(config.get("environment"));
  });
 
  after(function () {
    return browser
      .frame()
      .elementByLinkText('Logout').click()
      .quit();
  });

// TC8
  describe("View / Edit Notes", function() {
  
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
    
  });
  
});
