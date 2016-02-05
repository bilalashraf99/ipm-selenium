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

// TC12
  describe("Select Upline - Org", function() {
  
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
    
    var mainWindow;

    it("should click 'Select Parent Position'", function  () {
      return browser
        .elementById('childPositionTextBox').type("ChildPosition1")
        .windowHandle().then(function(handle) {
          mainWindow = handle;
        })
        .elementById('SelectParentPosition').click().windowHandles().then(function(handles) {
          handles.forEach(function(handle) {
            if (handle !== mainWindow) {
              return browser.window(handle);
            }
          });
        })
        .waitForElementById('firstNameTextBox', 5000).type("F")
        .elementByCss('input[value=Search]').click()
        .waitForElementById('selectUplineSearchTable', 5000)
        .elementByXPath('//td[normalize-space(text())="FirstName1"]/preceding-sibling::td/input').click()
        .elementByCss('input[value=Submit]').click().then(function() {
          return browser.window(mainWindow);
        })
        .frame('TaskShowFrame')
        .waitForElementById('parentPositionTextBox').getValue().should.become("ParentPosition");
    });
    
    it("should verify dynamic fields", function  () {
      return browser
        .elementByCss('input[name=newOrExistingPositionRadio][value="Existing Position"]').click()
        .waitForElementByCss('a#SelectChildPosition').click().windowHandles().then(function(handles) {
          handles.forEach(function(handle) {
            if (handle !== mainWindow) {
              return browser.window(handle);
            }
          });
        })
        .elementById('searchByOrganizationRadio').click()
        .elementById('organizationNameTextBox').type("o")
        .elementByCss('input[value=Search]').click()
        .waitForElementById('selectUplineSearchTable', 5000)
        .elementByXPath('//td[normalize-space(text())="ORG1"]/preceding-sibling::td/input').click()
        .elementByCss('input[value=Submit]').click().then(function() {
          return browser.window(mainWindow);
        })
        .frame('TaskShowFrame')
        .waitForElementById('childPositionTextBox').getValue().should.become("ChildPosition1");
    });
    
    it("should click on Submit button", function  () {
      return browser
        .elementByCss('input[value=Submit]').click();
    });
    
  });
  
});
