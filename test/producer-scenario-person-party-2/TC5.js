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
  describe("Initiate new OnBoarding instance", function() {
  
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
        .elementByCss('#combobox6 option[value="IFS Bank"]').click()
        .elementById('createButton').click()
        .sleep(2000)
        .waitForElementByCss('.x-message-box .x-header-text').text().should.eventually.not.contain('error');
    });
    
    it("should logout", function  () {
      return browser
        .frame()
        .elementByLinkText('Logout').click();
    });
    
    it("should log in as user '067600492'", function  () {
      return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("067600492.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("067600492.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
    });

    it("should attempt to enter valid value", function  () {
      return browser
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('0492')
        .elementByCss('form[name=form] input[type=submit]').click();
    });
    
    it("should expand all sections", function  () {
      return browser
        .frame('TaskShowFrame')
        .elementByLinkText('Expand All').click();
    });
    
    it("should fill in Errors and Omissions form data", function  () {
      return browser
        .elementById('CarrierDs').type('Carrier1')
        .elementById('PolicyNumberDs').type('1111')
        .elementById('ClaimLimitDs').type('2222')
        .elementById('PolicyLimitDs').type('3333')
        .elementById('CertificateNumberDs').type('certificate123');
    }); 
    
    it("should fill in Payment Accounts form data", function  () {
      var format = 'MMM DD, YYYY 00:00';
      return browser
        .elementById('AccountHolderNameDs1').type('Blumberg')
        .elementById('BankNameDs1').type('Bank1')
        .elementById('BankRoutingNumberDs1').type('1111')
        .elementById('AccountNumberDs1').type('2222')
        .elementById('date_Time3_id-inputEl').type(Date.today().toFormat(format))
        .elementById('date_Time5_id-inputEl').type(Date.tomorrow().toFormat(format));
    });
    
    it("should fill in Legal Questions form data", function  () {
      return browser
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=Yes]').then(function(elements) {
          var clicked = new Array();
          for (var i = 0; i < elements.length; i++) {
            clicked.push(elements[i].click());
          }
          return Promise.all(clicked);
        });
    });
    
    it("should fill in Appointment Requests form data", function  () {
      return browser
        .elementByXPath('//div[@id="licensesBODsDiv"]//td[contains(text(), "Michigan")]/following::input[1]').click();
    });

    it("should collapse all sections", function  () {
      return browser
        .elementByLinkText('Collapse All').click()
        .elementByCss('#headerLeftAndNavigationSummary').text().should.eventually.include("7 of 7 steps");
    });
    
    it("should click Submit", function () {
      return browser
        .elementByCss('input[value=Submit]').click();
    });

  });
  
});
