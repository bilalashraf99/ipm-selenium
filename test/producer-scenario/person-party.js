var config = require('nconf');
config.file({file: './test/config.json'});

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

var url = config.get("url");
var username = config.get("username");
var password = config.get("password");

describe("Producer scenario, Person Party", function() {
  this.timeout(30000);

  describe("TC1", function() {
    var browser;
   
    before(function (done) {
      browser = wd.promiseChainRemote(config.get("remote")); 

      // optional extra logging
      browser.on('status', function(info) {
        console.log(info);
      });
      browser.on('command', function(meth, path, data) {
        console.log(' > ' + meth, path, data || '');
      });

      browser
        .init(config.get("environment"))
        .nodeify(done);  //same as : .then(function() { done(); });
    });
   
    after(function (done) {
      browser
        .quit()
        .nodeify(done);
    });
   
    it("should load login page", function (done) {
      browser
        .get(url)
        .nodeify(done);
    });

    it("should enter username/password and submit", function  (done) {
      browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(username)
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(password)
        .elementByCss('form[name=loginForm] input[type=submit]').click()
        .nodeify(done);
    });
    
    it("should click OnBoarding link in My Widgets section", function  (done) {
      browser
        .waitForElementByLinkText('OnBoarding', 10000).click()
        .nodeify(done);
    });
    
    it("should click Create button", function  (done) {
      browser
        .frame('AppShowFrame')
        .waitForElementById('createButton', 15000).click()
        .nodeify(done);
    });
    
    it("should fill form with invalid data and submit", function  (done) {
      browser
        .elementById('TaxIdDs').type('123456789')
        .elementById('EmailDs').type('abc@gmail.com')
        .elementById('FirstNameDsStart').type('Thomas')
        .elementById('LastNameDsStart').type('Feola')
        .elementById('combobox6').type('ifs bank')
        .elementById('createButton').click()
        .nodeify(done);
    });
    
    it("should dismiss the popup message", function  (done) {
      browser
        .waitForElementByLinkText('OK', 10000).click()
        .nodeify(done);
    });
    
    it("should try to enter too long Tax ID", function  (done) {
      browser
        .elementById('TaxIdDs').type('1234567890')
        .nodeify(done);
    });
    
    it("should click on Logout link", function  (done) {
      browser
        .frame()
        .elementByLinkText('Logout').click()
        .nodeify(done);
    });
  });
});
