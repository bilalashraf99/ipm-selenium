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

// TC12
  describe("My Tasks widget - Advanced search", function() {
  
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
      
  });
  
});
