var config = require('nconf');
config.file({file: './test/config.json'});

require("date-utils");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

var url = config.get("ipm.url");

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
      .init(config.get("environment"));
  });
 
  after(function () {
    return browser
      .frame()
      .elementByLinkText('Logout').click()
      .quit();
  });

// TC5
  describe("Verify Tax ID", function() {
  
    it("should load login page", function () {
      return browser
        .get(url);
    });

    it("should log in as user '067600492'", function  () {
      return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("067600492.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("067600492.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
    });
  
    it("should make first attempt to enter invalid Tax ID", function  () {
      return browser
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('1111')
        .elementByCss('form[name=form] input[type=submit]').click()
        .elementByCss('.x-message-box').text().should.eventually.include('2 more attempt');
    });
    
    it("should dismiss the popup message", function  () {
      return browser
        .waitForElementByLinkText('OK', 10000).click();
    });
    
    it("should make second attempt to enter invalid Tax ID", function  () {
      return browser
        .elementByCss('form[name=form] input[name=Tax_Id]').type('2222')
        .elementByCss('form[name=form] input[type=submit]').click()
        .elementByCss('.x-message-box').text().should.eventually.include('1 more attempt');
    });
    
    it("should dismiss the popup message", function  () {
      return browser
        .waitForElementByLinkText('OK', 10000).click();
    });  

    it("should make third attempt to enter invalid Tax ID", function  () {
      return browser
        .elementByCss('form[name=form] input[name=Tax_Id]').type('3333')
        .elementByCss('form[name=form] input[type=submit]').click()
        .elementByCss('.x-message-box').text().should.eventually.include('Please contact the insurance company');
    });
    
    it("should dismiss the popup message", function  () {
      return browser
        .waitForElementByLinkText('OK', 10000).click();
    }); 
    
    it("should click on Logout link", function  () {
      return browser
        .waitForElementByLinkText('Logout').click();
    });

    it("should log in as user 'AnalystUser1'", function  () {
      return browser
        .frame()
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
    });
    
    // THIS ROW DOES NOT EXIST
    it("should click on new task among search results", function  () {
      return browser
        .waitForElementByXPath("//div[@id='SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/child::td/a", 10000)
        .click();
    });
 
    it("should select 'Continue OnBoarding?' and submit", function  () {
      return browser
        .frame('TaskShowFrame')
        .elementById('checkBox3').isSelected(function(err, res) { if (res == false) browser.elementById('checkBox3').click(); done(); });
        .elementById('createButton').click()
        .frame()
        .sleep(2000);
    });
    
    it("should logout", function  () {
      return browser
        .elementByLinkText('Logout').click();
    });

    it("should log in as user '067600492'", function  () {
      return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("067600492.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("067600492.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
    });
    
    it("should click Cancel", function  () {
      return browser
        .frame('TaskShowFrame')
        .waitForElementByLinkText('Cancel').click()
        .frame();
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
        .elementByCss('form[name=form] input[type=submit]').click()
        .waitForElementByCss('form[name=form]').text().should.eventually.include("Welcome to Aurea's Agent OnBoarding Process")
        .and.should.eventually.include("Basic Information")
        .and.should.eventually.include("Contact Information")
        .and.should.eventually.include("Errors and Omissions")
        .and.should.eventually.include("Payment Accounts")
        .and.should.eventually.include("Continuing Education")
        .and.should.eventually.include("Legal Questions")
        .and.should.eventually.include("Appointment Requests")
        .frame();
    });

  });

// TC6
  describe("Enter data - Expand, Collapse and Validate sections", function() {
    it("should expand all sections", function  () {
      return browser
        .frame('TaskShowFrame')
        .elementByLinkText('Expand All').click()
        // All sections should be expanded
        .waitForElementByCss('#basicInfoContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#contactInformationContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#errorsAndOmissionsContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#paymentAccountsContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#continuingEducationContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#legalQuestionsContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#appointmentRequestsContentDiv').isDisplayed().should.eventually.be.true
        // Only Basic Information, Contact Information and Continuing Education should be marked complete
        .elementByCss('#basicInfoHeaderStatus.completedSection')
        .elementByCss('#contactInformationHeaderStatus.completedSection')
        .elementByCss('#errorsAndOmissionsHeaderStatus.incompleteSection')
        .elementByCss('#paymentAccountsHeaderStatus.incompleteSection')
        .elementByCss('#continuingEducationHeaderStatus.completedSection')
        .elementByCss('#legalQuestionsHeaderStatus.incompleteSection')
        .elementByCss('#appointmentRequestsHeaderStatus.incompleteSection')
        // Left hand side panel
        .elementByCss('#headerLeftAndNavigationSummary').text().should.eventually.include("3 of 7 steps");
    });
    it("should collapse all sections", function  () {
      return browser
        .elementByLinkText('Collapse All').click()
        .waitForElementById('basicInfoContentDiv').isDisplayed().should.eventually.be.false
        .elementById('contactInformationContentDiv').isDisplayed().should.eventually.be.false
        .elementById('errorsAndOmissionsContentDiv').isDisplayed().should.eventually.be.false
        .elementById('paymentAccountsContentDiv').isDisplayed().should.eventually.be.false
        .elementById('continuingEducationContentDiv').isDisplayed().should.eventually.be.false
        .elementById('legalQuestionsContentDiv').isDisplayed().should.eventually.be.false
        .elementById('appointmentRequestsContentDiv').isDisplayed().should.eventually.be.false;
    });
    it("should click Show Task button", function  () {
      return browser
        .frame()
        .elementByXPath('//span[normalize-space(text())="Show Task"]').click();
    });
    it("should click Basic Information text in the left hand side panel", function  () {
      return browser
        .frame('TaskShowFrame')
        .elementById('basicInfoNavLink').click()
        .elementByCss('#basicInfoContentDiv').isDisplayed().should.eventually.be.true
        .elementById('FirstNameDs').getValue().should.become('John')
        .elementByCss('#LastNameDsTextBoxDiv input').getValue().should.become('Blumberg');
    });
    it("should click Contact Information text in the left hand side panel", function  () {
      return browser
        .elementById('contactInformationNavLink').click()
        .elementByCss('#contactInformationContentDiv').isDisplayed().should.eventually.be.true
        .waitForElementById('Street1Ds1').getValue().should.eventually.not.be.empty
        .elementById('CityDs1').getValue().should.eventually.not.be.empty
        .elementById('EmailDs1').getValue().should.become('solnsengg@gmail.com');
    });
    it("should click Errors and Ommissions text in the left hand side panel", function  () {
      return browser
        .elementById('errorsAndOmissionsNavLink').click()
        .elementByCss('#errorsAndOmissionsContentDiv').isDisplayed().should.eventually.be.true
        .waitForElementByXPath('//div[@id="errorsAndOmissionsContentDiv"]//td[normalize-space(text())="Tax ID :"]' +
        '/following-sibling::td[1]//input[@readonly]')
        .getValue().should.become('067600492');
    });
    it("should click Payment Accounts text in the left hand side panel", function  () {
      return browser
        .elementById('paymentAccountsNavLink').click()
        .elementByCss('#paymentAccountsContentDiv').isDisplayed().should.eventually.be.true
        .waitForElementById('AccountTypeDs1').getValue().should.become('DefaultPayment')
        .elementById('PaymentTypeDs1').getValue().should.become('W2');
    });
    it("should click Continuing Education text in the left hand side panel", function  () {
      return browser
        .elementById('continuingEducationNavLink').click()
        .elementByCss('#continuingEducationContentDiv').isDisplayed().should.eventually.be.true
        .elementByCss('#continuingEducationContentDiv #coursesName0')
        .elementByCss('#continuingEducationContentDiv #coursesName1')
        .elementByCss('#continuingEducationContentDiv #coursesName2');
    });
    it("should click Legal Questions text in the left hand side panel", function  () {
      return browser
        .elementById('legalQuestionsNavLink').click()
        .elementByCss('#legalQuestionsContentDiv').isDisplayed().should.eventually.be.true
        .waitForElementsByCss('#legalQuestionsContentDivTable tr:not([height])')
        .should.eventually.have.length(10);
    });
    it("should click Appointment Requests text in the left hand side panel", function  () {
      return browser
        .elementById('appointmentRequestsNavLink').click()
        .elementByCss('#appointmentRequestsContentDiv').isDisplayed().should.eventually.be.true;
    });

  });

// TC7
  describe("Enter data - Add producer information and Submit form", function() {
    it("should click Show Task button", function  () {
      return browser
        .frame()
        .elementByXPath('//span[normalize-space(text())="Show Task"]').click();
    });
    it("should click Submit", function  () {
      return browser
        .frame('TaskShowFrame')
        .elementByCss('input[value=Submit]').click()
        .waitForElementByCss('.x-message-box').text().should.eventually.include("Please complete all the sections");
    });
    it("should click OK to dismiss alert", function  () {
      return browser
        .elementByCss('.x-message-box span.x-btn-button').click();
    });
    it("should click Basic Information header", function  () {
      return browser
        .elementById('basicInfoHeader').click();
    });
    it("Fill in Basic Information form data", function  () {
      return browser
        .elementById('textField2').type('Mr')
        .elementById('MiddleNameDs').type('Abc')
        .elementById('GenderDs').type('Male')
        .elementById('textField7').type('John Abc Blumberg')
        .elementById('errorsAndOmissionsHeader').click();
    });
    it("Fill in Errors and Omissions form data", function  () {
      return browser
        .elementById('CarrierDs').type('CarrierOne')
        .elementById('PolicyNumberDs').type('1111')
        .elementById('ClaimLimitDs').type('2222')
        .elementById('PolicyLimitDs').type('3333')
        .elementById('CertificateNumberDs').type('certificate123')
        .elementById('paymentAccountsHeader').click();
    });    
    it("Fill in Payment Accounts form data", function  () {
      var format = 'MMM DD, YYYY 00:00';
      return browser
        .elementById('AccountHolderNameDs1').type('John Blumberg')
        .elementById('BankNameDs1').type('TestBankName')
        .elementById('BankRoutingNumberDs1').type('123456')
        .elementById('AccountNumberDs1').type('654321')
        .elementById('date_Time3_id-inputEl').type(Date.today().toFormat(format))
        .elementById('date_Time5_id-inputEl').type(Date.tomorrow().toFormat(format))
        .elementById('continuingEducationHeader').click();
    });
    it("Fill in Continuing Education form data", function  () {
      var nextDayXPath = '//div[contains(concat(" ", normalize-space(@class), " "), " x-datepicker ") and not(contains(@style,"display: none"))]'
        + '//td[contains(concat(" ", normalize-space(@class), " "), " x-datepicker-today ")]/following::td[1]';
      return browser
        .elementByCss('div#continuingEducationContentDiv input#date_Time0-inputEl').click()
        .sleep(100).elementByXPath(nextDayXPath).click()
        .elementByCss('div#continuingEducationContentDiv input#date_Time1-inputEl').click()
        .sleep(100).elementByXPath(nextDayXPath).click()
        .elementByCss('div#continuingEducationContentDiv input#date_Time2-inputEl').click()
        .sleep(100).elementByXPath(nextDayXPath).click()
        .elementById('legalQuestionsHeader').click();
    });
    it("Fill in Legal Questions form data", function  () {
      return browser
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=Yes]').then(function(elements) {
          for (var i = 0; i < elements.length; i++) {
            elements[i].click();
          }
        }).elementById('appointmentRequestsHeader').click();
    });
    it("Fill in Appointment Requests form data", function  () {
      return browser
        .elementByXPath('//div[@id="licensesBODsDiv"]//td[contains(text(), "Michigan")]/following::input[1]').click()
        .elementByCss('select#unclicensedStateDD').type('Alabama')
        .elementByCss('input#addUnlicensedStateButton').click()
        .elementByCss('div#unlicensedStateContentDiv').text().should.become('Alabama')
        .elementByCss('select#unclicensedStateDD').getValue().should.become('Select One');
    });
    it("Add additional unlicenesed state", function  () {
      return browser
        .elementByCss('select#unclicensedStateDD').type('Alaska')
        .elementByCss('input#addUnlicensedStateButton').click()
        .elementByCss('div#unlicensedStateContentDiv').text()
        .should.eventually.include('Alabama').and.should.eventually.include('Alaska')
        .elementByCss('select#unclicensedStateDD').getValue().should.become('Select One');
    });
    it("Should click 'X' sign beside 'Alabama'", function() {
      return browser
        .elementByXPath('//span[normalize-space(text())="Alabama"]/following-sibling::span').click()
        .elementByCss('div#unlicensedStateContentDiv').text()
        .should.eventually.not.include('Alabama');
    });
    it("Should click on Submit button", function() {    
      return browser
        .elementByCss('input[value=Submit]').click()
        .waitForElementByCss('div#unlicensedStateNamesDiv').should.eventually.include('Alaska');
    });
    it("Should click on Complete button", function() {    
      return browser
        .elementByCss('input[value=Complete]').click();
    });
  });

});
