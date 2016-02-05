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

// TC11
  describe("EnterDataAndReviewDocs - Submit form - Org", function() {
  
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
    
    it("should click on EnterDataAndReviewDocs", function  () {
      return browser
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('020258767')
        .elementByCss('input#search').click()
        .waitForElementByLinkText('EnterDataAndReviewDocs', 10000).click();
    });
    
    it("should fill in Contact Information form data", function  () {
      return browser
        .frame('TaskShowFrame')
        .waitForElementById('contactInformationHeader').click()
        .elementById('Street1Ds1').type('s1')
        .elementById('CityDs1').type('cityone')
        .elementById('StateDs1').type('california')
        .elementById('ZipDs1').type('1111')
        .elementById('PhoneDs1').type('2222')
        .elementById('EmailDs1').type('solnsengg@gmail.com');
    });
    
    it("should fill in Errors and Omissions form data", function  () {
      return browser
        .elementById('errorsAndOmissionsHeader').click()
        .elementByCss('#PolicyTypeDs option[value=Bond]').click()
        .elementById('CarrierDs').type('111')
        .elementById('PolicyNumberDs').type('222')
        .elementById('ClaimLimitDs').type('333')
        .elementById('PolicyLimitDs').type('444')
        .elementById('CertificateNumberDs').type('555')
        .elementById('paymentAccountsHeader').click();
    }); 
    
    it("should fill in Payment Accounts form data", function  () {
      return browser
        .elementById('AccountTypeDs1').type('escrow')
        .elementById('PaymentTypeDs1').type('1099')
        .elementById('AccountHolderNameDs1').type('Willis')
        .elementById('BankNameDs1').type('bank1')
        .elementById('BankRoutingNumberDs1').type('111')
        .elementById('AccountNumberDs1').type('222')
        .elementById('date_Time3_id-inputEl').type("Jan 01, 2015 00:00")
        .elementById('date_Time5_id-inputEl').type("Jan 01, 2300 00:00");
    });
    
    it("should fill in Legal Questions form data", function  () {
      return browser
        .elementById('legalQuestionsHeader').click()
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=No]').then(function(elements) {
          for (var i = 0; i < elements.length; i++) {
            elements[i].click();
          }
        });
    });

    it("should fill in Appointment Requests form data", function  () {    
      return browser
        .elementById('appointmentRequestsHeader').click()
        .elementByXPath('//div[@id="licensesBODsDiv"]//td[contains(text(), "New Hampshire - Resident Producer")]/following::input[1]')
        .click();    
    });
    
    it("should fill in Upload Documents form data", function  () {    
      return browser
        .elementById('uploadDocumentsHeader').click()
        .elementsByCss('#RequiredDocNamesTableDiv tr td:nth-child(2) input[type=radio]').then(function(elements) {
          for (var i = 0; i < elements.length; i++) {
            elements[i].click();
          }
        })
        .elementsByCss('#RequiredDocNamesTableDiv tr td:nth-child(5) input[type=radio]').then(function(elements) {
          for (var i = 0; i < elements.length; i++) {
            elements[i].click();
          }
        });
    });
    
    it("should click Collapse All and reopen Upload Documents section", function  () {
      return browser
        .elementByLinkText('Collapse All').click()
        .elementById('uploadDocumentsHeader').click()
        .elementById('headerLeftAndNavigationSummary').text().should.become("8 of 8 steps complete");
    })
    
    it("Should click on Submit button", function() {    
      return browser
        .elementByCss('input[value=Submit]').click()
        .waitForElementByCss('div#midPanelHeader').text().should.become('Select Up-line');
    });
    
  });
  
});
