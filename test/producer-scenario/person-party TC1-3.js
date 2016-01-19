var config = require('nconf');
config.file({file: './test/config.json'});

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

var url = config.get("url");
var username = config.get("analyst.username");
var password = config.get("analyst.password");

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
 
  after(function () {
    return browser
      .frame()
      .elementByLinkText('Logout').click()
      .quit();
  });

// TC1
  describe("TC1", function() {
  
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
        .waitForElementById('createButton', 15000).click();
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

// TC2
  describe("TC2", function() {
    it("should click on Dashboard tab", function  () {
      return browser
        .frame()
        .elementByLinkText('Dashboard').click();
    });
    
    it("should click OnBoarding link in My Widgets section", function  () {
      return browser
        .waitForElementByLinkText('OnBoarding', 10000).click();
    });
    
    it("should select Organization in Party type dropdown", function  () {
      return browser
        .frame('AppShowFrame')
        .elementById('combobox1').type('organization');
    });
    
    it("should submit an empty form", function  () {
      return browser
        .waitForElementById('createButton', 15000).click();
    });
    
    it("should fill form with invalid data and submit", function  () {
      return browser
        .elementById('TaxIdDs').type('123456789')
        .elementById('EmailDs').type('abc@gmail.com')
        .elementById('OrganizationNameDsStart').type('TestOrg')
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
  
// TC3
  describe("TC3", function() {
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
        .elementById('combobox1').type('organization')
        .elementById('TaxIdDs').type('123456789')
        .elementById('EmailDs').type('abc@gmail.com')
        .elementById('OrganizationNameDsStart').type('TestOrg')
        .elementById('combobox6').type('ifs bank')
        .elementById('checkbox1').click()
        .elementById('checkbox2').click();
    });
    
    it("should click on Reset button", function  () {
      browser.elementByLinkText('Reset').click();
      return Promise.all([
//        browser.elementById('combobox1').getValue().should.eventually.equal('Person'),
        browser.elementById('TaxIdDs').getValue().should.eventually.be.empty,
        browser.elementById('EmailDs').getValue().should.eventually.be.empty,
        browser.elementById('OrganizationNameDsStart').getValue().should.eventually.be.empty,
        browser.elementById('combobox6').getValue().should.become('Select One'),
        browser.elementById('checkbox1').isSelected().should.become(false),
        browser.elementById('checkbox2').isSelected().should.become(true)
      ]);
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
        .elementById('combobox6').type('ifs bank')
        .elementById('checkbox1').click()
        .elementById('checkbox2').click();
    });
    
    it("should click on Reset button", function  () {
      browser.elementByLinkText('Reset').click();
      return Promise.all([
        browser.elementById('TaxIdDs').getValue().should.eventually.be.empty,
        browser.elementById('EmailDs').getValue().should.eventually.be.empty,
        browser.elementById('OrganizationNameDsStart').getValue().should.eventually.be.empty,
        browser.elementById('combobox6').getValue().should.become('Select One'),
        browser.elementById('checkbox1').isSelected().should.become(false),
        browser.elementById('checkbox2').isSelected().should.become(true)
      ]);
    });
  });
  
});