var config = require('nconf');
config.file({file: './test/config.json'});

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

var url = config.get("ipm.url");
var username = config.get("analyst.username");
var password = config.get("analyst.password");

describe("Producer scenario, Person party", function() {
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

// TC1
  describe("Validate fields in Initiate New Onboarding - Producer", function() {
  
    it("should load login page", function () {
      return browser
        .get(url);
    });

    it("should enter username/password and submit", function  () {
      return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(username)
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(password)
        .elementByCss('form[name=loginForm] input[type=submit]').click();
    });
    
    it("should click OnBoarding link in My Widgets section", function  () {
      return browser
        .waitForElementByLinkText('OnBoarding', 10000).click();
    });
    
    it("should submit an empty form", function  () {
      return browser
        .frame('AppShowFrame')
        .waitForElementById('createButton', 15000).click()
        .elementByXPath("//*[@id='TaxIdDs_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='EmailDs_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='FirstNameDsStart_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='LastNameDsStart_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('*required')
        .elementByXPath("//*[@id='combobox6_div']/ancestor::td[1]/following-sibling::td[1]").text().should.become('* required');
    });
    
    it("should fill form with invalid data and submit", function  () {
      return browser
        .elementById('TaxIdDs').type('123456789')
        .elementById('EmailDs').type('abc@gmail.com')
        .elementById('FirstNameDsStart').type('Thomas')
        .elementById('LastNameDsStart').type('Feola')
        .elementById('combobox6').type('ifs bank')
        .elementById('createButton').click();
    });
    
    it("should dismiss the popup message", function  () {
      return browser
        .waitForElementByLinkText('OK', 10000).click();
    });
    
    it("should try to enter too long Tax ID", function  () {
      return browser
        .elementById('TaxIdDs').type('1234567890')
        .getValue().should.become('123456789');
    });
  });
  
});
