var config = require('nconf');
config.file({file: './test/config.json'});

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

var url = config.get("ipm.url");

describe("Producer Scenario, Person Party - Session 2", function() {
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

// TC4
  describe("Reject Onboarding", function() {
  
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
    
    it("should click on new Approval task among search results", function  () {
      var approvalXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='326588332']/parent::tr/child::td[@data-qtip='Fred Sellers']/parent::tr/descendant::a[normalize-space(text())='Approval']";
      var nested = function(e) {
        return browser
          .elementByCss('#SearchResults a[data-qtip="Next Page"]:not(.x-btn-disabled)').then(function(ref){
            return ref.click()
              .waitForElementByXPath(approvalXPath)
              .catch(nested);
          });
      }        
      return browser
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('326588332')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(approvalXPath)
        .catch(nested).click();
    });
    
    it("should enter comment and Reject", function  () {
      return browser
        .waitForElementByCss('iframe')
        .frame('TaskShowFrame')
        .elementByCss('textarea#txaCurrComm').type("OB application rejected by AnalystUser1")
        .elementByCss('input[value=Reject]').click().sleep(5000);
    });
    
    it("should click on Dashboard tab", function  () {
      return browser
        .frame()
        .elementByLinkText('Dashboard', 10000).click();
    });

    it("should see task with Completed status", function  () {
      var taskXPath = "//*[@id='case_SearchResults']/descendant::td[@data-qtip='326588332']/parent::tr/child::td[@data-qtip='Fred Sellers']/parent::tr/child::td[@data-qtip='COMPLETED']";
      return browser
        .waitForElementByCss('select#case_searchField1 option[value=TAX_ID]').click()
        .elementByCss('input#case_searchText').type('326588332')
        .elementByCss('input#case_search').click()
        .waitForElementByXPath(taskXPath);
    });
    
    it("should click on My Worksteps tab", function  () {
      return browser
        .frame()
        .elementByLinkText('My Worksteps', 10000).click();
    });
    
  });
  
});
