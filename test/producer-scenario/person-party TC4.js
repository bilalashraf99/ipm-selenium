var config = require('nconf');
config.file({file: './test/config.json'});

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

var url = config.get("url");

describe("Producer scenario, Person Party", function() {
  this.timeout(30000);
  
  var browser;
   
  before(function () {
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
 
/*  after(function () {
    return browser
      .frame()
      .elementByLinkText('Logout').click()
      .quit();
  });*/

// TC4
  describe("TC4", function() {
  
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
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.username"))
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
        .elementById('createButton').click();
    });
    
    it("should click on Dashboard tab", function  () {
      return browser
        .frame()
        .elementByLinkText('Dashboard', 10000).click();
    });
    
    it("should have new case among search results", function  () {
      var row;
      var searchResultTableRows = browser.waitForElementsByCss('#case_SearchResultsDefault_grid tr').then(function(rows) {
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (row.elementByCss(':nth-child(7)').text() === '061328137') {
            break;
          }
        }        


      return Promise.all([        
        row.elementByCss('td[data-qtip="Minal Feola"]').text().should.become('Minal Feola'),
        row.elementByCss('td[data-qtip="061328137"]').text().should.become('061328137'),
        row.elementByCss(':nth-child(3)').text().should.become('ACTIVATED')
//        browser.waitForElementByCss('#case_SearchResultsDefault_grid td[data-qtip="John Blumberg"]').text().should.become('John Blumberg'),
//        browser.elementByCss('#case_SearchResultsDefault_grid td[data-qtip=067600492]').text().should.become('067600492')

//        browser.waitForElementByCss('#case_SearchResultsDefault_grid td[data-qtip="Minal Feola"]').text().should.become('Minal Feola'),
//        browser.elementByCss('#case_SearchResultsDefault_grid td[data-qtip="061328137"]').text().should.become('061328137')
      ]);
      
      });
    });
    
  });
  
});
