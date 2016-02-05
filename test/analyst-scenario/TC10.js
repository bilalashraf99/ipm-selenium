var config = require('nconf');
config.file({file: './test/config.json'});

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

var url = config.get("ipm.url");
var dcmUrl = config.get("dcm.url");

describe("Analyst Scenario", function() {
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

// TC10
  describe("Create instance - Org", function() {
  
    it("should load login page", function () {
      return browser
        .get(url);
    });

    it("should enter username/password and submit", function  () {
      return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
    });
    
    it("should click OnBoarding link in My Widgets section", function  () {
      return browser
        .waitForElementByLinkText('OnBoarding', 10000).click();
    });
    
    it("should fill form with Organization data and submit", function  () {
      return browser
        .frame('AppShowFrame')
        .elementByCss('#combobox1 option[value=Organization]').click()
        .elementById('TaxIdDs').type('020258767')
        .elementById('EmailDs').type('solnsengg@gmail.com')
        .elementById('OrganizationNameDsStart').type('Willis Of New Hampshire Inc')
        .elementByCss('#combobox6 option[value=LLIC]').click()
        .elementById('checkbox1').click()
        .elementById('checkbox2').click()
        .elementById('createButton').click()
        .sleep(2000)
        .waitForElementByCss('.x-message-box .x-header-text').text().should.eventually.not.contain('error');
    });
    
    it("should click on My Worksteps tab", function  () {
      var workstepXPath = '//div[normalize-space(text())="Enter Data & Review Docs"]/parent::td/following-sibling::td//a[normalize-space(text())="AnalystUser1"]';
      return browser
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementByXPath(workstepXPath);
    });
    
    it("should click on Dashboard tab and verify new case among search results", function  () {
      return browser
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('#case_SearchResultsDefault a[data-qtip=Refresh]').click()
        .waitForElementByXPath("//*[@id='case_SearchResultsDefault']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/child::td[@data-qtip='ACTIVATED']", 10000);
    });
    
    it("should logout", function  () {
      return browser
        .elementByLinkText('Logout').click();
    });
    
    it("should load DCM login page", function () {
      return browser
        .get(dcmUrl);
    });
    
    it("should log in as user 'sa'", function  () {
      return browser
        .elementByCss('form[name=LoginForm] input[name=LOGINNAME]').type(config.get("sa.username"))
        .elementByCss('form[name=LoginForm] input[name=PASSWORD]').type(config.get("sa.password"))
        .elementByCss('form[name=LoginForm] input[type=SUBMIT]').click();
    });
    
    it("should navigate to Party -> Party", function  () {
      return browser
        .frame("navbar")
        .waitForElementByCss('a#Party').click();
    });

    it("should perform search on Tax ID", function  () {
      return browser
        .frame()
        .frame("container")
        .frame("cacheframe0")
        .frame("subpage")
        .waitForElementByCss('#Search_Person_Main_primary_display_div select').type('search for org')
        .waitForElementByCss('input[name=Field_Person_Main_TaxID_Search_Value]').type('020258767')
        .elementByLinkText('Search').click()
        .waitForElementByCss('table[name=Grid_Person_Main] tbody td:nth-child(2)').text().should.become('Willis Of New Hampshire Inc')
        .elementByCss('table[name=Grid_Person_Main] tbody td:nth-child(4)').text().should.become('***-**-8767')
        .elementByCss('table[name=Grid_Person_Main] tbody td:nth-child(10)').text().should.become('solnsengg@gmail.com');
    });
    
    it("should logout", function  () {
      return browser
        .frame()
        .frame("navbar")
        .elementByLinkText('Logout').click();
    });

  });
  
});
