var config = require('nconf');
config.file({file: './test/config.json'});

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

// TC10
  describe("Approval - View producer information and Approval - Accept / Reject sections and perform Fix action", function() {
  
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
      var approvalXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/descendant::a[normalize-space(text())='Approval']";
      var nested = function(e) {
        return browser
          .elementByCss('#SearchResults a[data-qtip="Next Page"]:not(.x-btn-disabled)').then(function(ref){
            return ref.click()
              .waitForElementByXPath(approvalXPath)
              .catch(nested);
          });
      }        
      return browser
        .waitForElementByCss('select#searchField').type('TAX_ID')
        .elementByCss('input#searchText').type('067600492')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(approvalXPath)
        .catch(nested).click();
    });
    
    it("should verify Basic Information section", function  () {
      return browser
        .frame('TaskShowFrame')
        .elementByCss('input[name=textField2]:disabled').getValue().should.become('Mr')
        .elementByCss('input[name=MiddleNameDs]').getValue().should.become('Abc')
        .elementByCss('input[name=GenderDs]').getValue().should.become('Male')
        .elementByCss('input[name=GenderDs]').getValue().should.become('Male')
        .elementByCss('input[name=textField7]').getValue().should.become('John Abc Blumberg')
    });
    
    it("should verify Contact Information section", function  () {
      return browser
        .elementByCss('input[name=EmailDs1]:disabled').getValue().should.eventually.not.be.empty;
    });
    
    it("should verify Errors and Omissions section", function  () {
      return browser
        .elementByCss('input[name=CarrierDs]:disabled').getValue().should.become('CarrierOne')
        .elementByCss('input[name=PolicyNumberDs]:disabled').getValue().should.become('1111')
        .elementByCss('input[name=ClaimLimitDs]:disabled').getValue().should.become('2222')
        .elementByCss('input[name=PolicyLimitDs]:disabled').getValue().should.become('3333')
        .elementByCss('input[name=CertificateNumberDs]:disabled').getValue().should.become('certificate123');
    });
    
    it("should verify Payment Accounts section", function  () {
      return browser
        .elementByCss('input[name=AccountHolderNameDs1]:disabled').getValue().should.become('John Blumberg');
    });
    
    it("should verify Continuing Education section", function  () {
      return browser
        .elementByCss('#continuingEducationContentDiv').text().should.eventually.include('IA Index Training');
    });
    
    it("should verify Legal Questions section", function  () {
      return browser
        .elementsByCss('#legalQuestionsContentDiv input[value=Yes]').then(function(elements) {
          var result = new Array();
          for (var i=0; i<elements.length; i++) {
            result.push(elements[i].isSelected());
          }
          return Promise.all(result);
        });
    });
    
    it("should verify Appointment Requests section", function  () {
       return browser
        .elementByXPath('//div[@id="appointmentRequestsContentDiv"]//td[contains(text(), "Michigan")]/following-sibling::td//input[@type="checkbox"]')
        .isSelected()
        .elementByCss('div[name=unlicensedStateContentDiv]').text().should.become('Alaska');
    });
    
    it("should verify Upload Documents section", function  () {
      // No such section!
    });
    
    it("should verify E-Sign Documents section", function  () {
       // No such section!     
    });
    
    it("should reject and accept sections", function() {
      return browser
        .elementByCss('textarea#StatusReason_EDUD_BasicInfoApproval').type('Rejected by AnalystUser')
        .elementByCss('div#basicInfoContentDiv').elementByLinkText('Reject').click()
        .elementByCss('textarea#StatusReason_EDUD_ContactInfoApproval').type('Rejected by AnalystUser')
        .elementByCss('div#contactInformationContentDiv').elementByLinkText('Reject').click()      
        .elementByCss('textarea#StatusReason_EDUD_EnOApproval').type('Accepted by AnalystUser')
        .elementByCss('div#errorsAndOmissionsContentDiv').elementByLinkText('Accept').click()
        .elementByCss('textarea#StatusReason_EDUD_PaymentInfoApproval').type('Accepted by AnalystUser')
        .elementByCss('div#paymentAccountsContentDiv').elementByLinkText('Accept').click() 
        .elementByCss('textarea#StatusReason_EDUD_ContEdApproval').type('Accepted by AnalystUser')
        .elementByCss('div#continuingEducationContentDiv').elementByLinkText('Accept').click()
        .elementByCss('textarea#StatusReason_EDUD_LeagalQuesApproval').type('Accepted by AnalystUser')
        .elementByCss('div#legalQuestionsContentDiv').elementByLinkText('Accept').click() 
        .elementByCss('textarea#StatusReason_EDUD_AppApproval').type('Accepted by AnalystUser')
        .elementByCss('div#appointmentRequestsContentDiv').elementByLinkText('Accept').click() 
        // TODO: Upload Documents section?
        // TODO: E-Sign Documents section?
        .elementByCss('textarea[name=txaCurrComm]').type('Some sections are rejected by Analyst');
        .elementByCss('input[type=submit][value=Fix]').click();
    });
  });
  
});
