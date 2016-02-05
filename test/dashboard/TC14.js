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

// TC14
  describe("My Widgets - Basic search", function() {
  
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
    
  });
  
});
