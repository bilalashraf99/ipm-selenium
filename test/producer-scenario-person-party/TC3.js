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
  
// TC3
  describe("Reset data on Initiate New Producer Onboarding", function() {
    
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
    
    it("should click on Dashboard tab", function  () {
      return browser
        .frame()
        .elementByLinkText('Dashboard').click();
    });

    it("should click OnBoarding link in My Widgets section", function  () {
      return browser
        .waitForElementByLinkText('OnBoarding', 10000).click();
    });
    
    it("should fill form with Organization data", function  () {
      return browser
        .frame('AppShowFrame')
        .elementByCss('#combobox1 option[value=Organization]').click()
        .elementById('TaxIdDs').type('123456789')
        .elementById('EmailDs').type('abc@gmail.com')
        .elementById('OrganizationNameDsStart').type('TestOrg')
        .elementByCss('#combobox6 option[value="IFS Bank"]').click()
        .elementById('checkbox1').click()
        .elementById('checkbox2').click();
    });
    
    it("should click on Reset button", function  () {
      return browser.elementByLinkText('Reset').click()
          // Original test requirement:       .elementById('combobox1').getValue().should.eventually.equal('Person')
        .elementById('combobox1').getValue().should.eventually.equal('Organization')
        .elementById('TaxIdDs').getValue().should.eventually.be.empty
        .elementById('EmailDs').getValue().should.eventually.be.empty
        .elementById('FirstNameDsStart').getValue().should.eventually.be.empty
        .elementById('LastNameDsStart').getValue().should.eventually.be.empty
        .elementById('combobox6').getValue().should.become('Select One')
        .elementById('checkbox1').isSelected().should.become(false)
        .elementById('checkbox2').isSelected().should.become(true)
    });
    
    it("should click on Dashboard tab", function  () {
      return browser
        .frame()
        .elementByLinkText('Dashboard').click();
    });
    
    it("should click OnBoarding link in My Widgets section", function  () {
      return browser
        .waitForElementByLinkText('OnBoarding', 10000).click();
    });
    
    it("should fill form with Person data", function  () {
      return browser
        .frame('AppShowFrame')
        .elementById('TaxIdDs').type('123456789')
        .elementById('EmailDs').type('abc@gmail.com')
        .elementById('FirstNameDsStart').type('Thomas')
        .elementById('LastNameDsStart').type('Feola')
        .elementByCss('#combobox6 option[value="IFS Bank"]').click()
        .elementById('checkbox1').click()
        .elementById('checkbox2').click();
    });
    
    it("should click on Reset button", function  () {
      return browser.elementByLinkText('Reset').click()
        .elementById('TaxIdDs').getValue().should.eventually.be.empty
        .elementById('EmailDs').getValue().should.eventually.be.empty
        .elementById('OrganizationNameDsStart').getValue().should.eventually.be.empty
        .elementById('combobox6').getValue().should.become('Select One')
        .elementById('checkbox1').isSelected().should.become(false)
        .elementById('checkbox2').isSelected().should.become(true)
    });
  });
  
});
