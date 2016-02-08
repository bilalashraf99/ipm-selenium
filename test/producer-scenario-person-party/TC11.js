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

// TC11
  describe("Enter data - View approver comments and modify data after Fix action", function() {
  
    it("should load login page", function () {
      return browser
        .get(url);
    });

    it("should log in as user '067600492'", function  () {
      return browser
        .waitForElementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("067600492.username"))
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
        .elementByLinkText('Expand All').click()
        .elementById('basicInfoRejectReason').text().should.become('AnalystUser1 : Rejected : Rejected by AnalystUser')
        .elementById('contactInformationRejectReason').text().should.become('AnalystUser1 : Rejected : Rejected by AnalystUser')
        .elementById('errorsAndOmissionsRejectReason').text().should.become('AnalystUser1 : Accepted : Accepted by AnalystUser')
        .elementById('legalQuestionsRejectReason').text().should.become('AnalystUser1 : Accepted : Accepted by AnalystUser')
        .elementByCss('textarea[name=textArea1]').getValue().should.become('AnalystUser1 : Fix : Some sections are rejected by Analyst');
    });
    
    it("should click on Submit", function  () {
      return browser
        .elementByCss('input[value=Submit]').click();
    });
    
    // FIXME: Upload Document and E-Sign Documents section missing!
    
    it("should click on Submit", function  () {
      return browser
        .waitForElementByCss('div#resultDiv', 10000).text()
        .should.eventually.include("Thank you for completing your application. It will now be reviewed internally.");
    });
    
  });
  
});
