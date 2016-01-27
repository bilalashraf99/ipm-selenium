var config = require('nconf');
config.file({file: './test/config.json'});

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

var url = config.get("ipm.url");
var dcmUrl = config.get("dcm.url");

describe("Producer scenario, Person Party", function() {
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
      .init(config.get("environment"))
      .setWindowSize(1200, 1000);
  });
 
  after(function () {
    return browser
      .quit();
  });

// TC4
  describe("Initiate New Onboarding process", function() {
  
    it("should load login page", function () {
      return browser
        .get(url);
    });

    it("should log in as user 'ebms'", function  () {
      return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("ebms.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("ebms.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
    });
    
    it("should click on Administration tab", function  () {
      return browser
        .waitForElementByLinkText('Administration', 10000).click();
    });
    
    it("should click on User Management", function  () {
      return browser
        .waitForElementByLinkText('User Management', 10000).click();
    });
    
    it("should click on Add button on the right hand side", function  () {
      return browser
        .elementByCss('span.x-btn-button span.bmAdd').click();
    });
    
    it("should fill form with user data and submit", function  () {
      return browser
        .frame('createPanelIframe')
        .elementByCss('input[name=userName]').type('067600492')
        .elementByCss('input[name=password]').type('password')
        .elementByCss('input[name=confPassword]').type('password')
        .elementByCss('input[name=firstName]').type('John')
        .elementByCss('input[name=lastName]').type('Blumberg')
        .elementByCss('input[name=email]').type('solnsengg@gmail.com')
        .elementByCss('input[name=createUser]').click();
    });
    
    it("should logout", function  () {
      return browser
        .frame()
        .elementByLinkText('Logout').click();
    });
    
    it("should log in as user 'AnalystUser1'", function  () {
      return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
    });
    
    it("should click OnBoarding link in My Widgets section", function  () {
      return browser
        .waitForElementByLinkText('OnBoarding', 10000).click();
    });

    it("should fill form with user data and submit", function  () {
      return browser
        .frame('AppShowFrame')
        .elementById('TaxIdDs').type('067600492')
        .elementById('EmailDs').type('solnsengg@gmail')
        .elementById('FirstNameDsStart').type('John')
        .elementById('LastNameDsStart').type('Blumberg')
        .elementById('combobox6').type('ifs bank')
        .elementById('createButton').click()
        .sleep(2000)
        .waitForElementByCss('.x-message-box .x-header-text').text().should.eventually.not.contain('error');
    });
    
    it("should click on Dashboard tab", function  () {
      return browser
        .frame()
        .elementByLinkText('Dashboard', 10000).click();
    });
    
    it("should have new case among search results", function  () {
      return browser
        .waitForElementByCss('select#case_searchField').type('TAX_ID')
        .waitForElementByCss('input#case_searchText').type('067600492')
        .waitForElementByCss('input#case_search').click()
        .waitForElementByXPath("//*[@id='case_SearchResultsDefault']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/child::td[@data-qtip='ACTIVATED']", 10000);
    });
    
    it("should logout", function  () {
      return browser
        .frame()
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
        .waitForElementByCss('input[name=Field_Person_Main_TaxID_Search_Value]').type('067600492')
        .elementByLinkText('Search').click()
        .waitForElementByCss('table[name=Grid_Person_Main] tbody td:nth-child(2)').text().should.become('Blumberg')
        .elementByCss('table[name=Grid_Person_Main] tbody td:nth-child(5)').text().should.become('***-**-0492')
        .elementByCss('table[name=Grid_Person_Main] tbody td:nth-child(11)').text().should.become('solnsengg@gmail.com');
    });
    
    it("should logout", function  () {
      return browser
        .frame()
        .frame("navbar")
        .elementByLinkText('Logout').click();
    });
    
  });
  
});
