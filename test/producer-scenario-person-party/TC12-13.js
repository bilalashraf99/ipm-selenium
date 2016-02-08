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

// TC12
  describe("Approval - Approve action", function() {
  
    it("should load login page", function () {
      return browser
        .get(url);
    });

    it("should log in as user 'AnalystUser1'", function  () {
      return browser
        .waitForElementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
    });
    
    it("should click on Approval task among search results", function  () {
      var approvalXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/descendant::a[normalize-space(text())='Approval']";
      var nested = function(e) {
        return browser
          .waitForElementByCss('#SearchResults a[data-qtip="Next Page"]:not(.x-btn-disabled)').then(function(ref){
            return ref.click()
              .waitForElementByXPath(approvalXPath)
              .catch(nested);
          });
      }        
      return browser
        .waitForElementByCss('select#searchField option[value=TAX_ID]', 5000).catch(function(e) {
          console.log(e);
          return browser.sleep(1000).waitForElementByCss('select#searchField');
        }).click()
        .elementByCss('input#searchText').type('067600492')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(approvalXPath)
        .catch(nested).click();
    });
    
    it("should verify updated Preferred Name", function  () {
      return browser
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementByCss('input[name=textField7]').getValue().should.become('Blumberg');
    });
    
    it("should click on Approve", function  () {
      return browser
        .waitForElementByCss('input[value=Approve]').click()
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementById('midPanelHeader').text().should.eventually.include("Select Up-line");
    });
    
    it("should log out", function  () {
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
    
    it("should click on new Upline task among search results", function  () {
      var approvalXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/descendant::a[normalize-space(text())='Select Upline']";
      var nested = function(e) {
        return browser
          .waitForElementByCss('#SearchResults a[data-qtip="Next Page"]:not(.x-btn-disabled)').then(function(ref){
            return ref.click()
              .waitForElementByXPath(approvalXPath)
              .catch(nested);
          });
      }        
      return browser
        .waitForElementByCss('select#searchField option[value=TAX_ID]', 5000).catch(function(e) {
          console.log(e);
          return browser.sleep(1000).waitForElementByCss('select#searchField');
        }).click()
        .elementByCss('input#searchText').type('067600492')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(approvalXPath)
        .catch(nested).click();
    });
    
    it("should verify Select Up-line page", function  () {
      return browser
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementById('midPanelHeader').text().should.eventually.include("Select Up-line");
    });
    
  });
  
// TC13
  describe("Select Upline", function() {  
    it("should click 'Select Parent Position'", function  () {
      var mainWindow;
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
        .waitForElementByCss('a#SelectChildPosition').isVisible()
        .elementByCss('input[name=newOrExistingPositionRadio][value="New Position"]').click()
        .elementByCss('select#positionTypeCombo option[value=Producer]').click()
//        .elementByCss('input#childPositionTextBox:not([readonly])').keys("ChildPosition1")
        .elementByCss('input[value=Submit]').click();
    });
  });
  
});
