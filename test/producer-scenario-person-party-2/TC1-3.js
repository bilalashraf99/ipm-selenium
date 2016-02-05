var config = require('nconf');
config.file({file: './test/config.json'});

require("date-utils");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

var url = config.get("ipm.url");

describe("Producer Scenario, Person Party - Session 2", function() {
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
  describe("Initiate new OnBoarding instance and Enter Data", function() {
  
    it("should load login page", function () {
      return browser
        .get(url);
    });

    it("should log in as user 'ebms'", function  () {
      return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("ebms.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("ebms.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
    });
    
    it("should click on Administration tab", function  () {
      return browser
        .waitForElementByLinkText('Administration', 10000).click();
    });
    
    it("should click on User Management", function  () {
      return browser
        .waitForElementByLinkText('User Management', 10000).click();
    });
    
    it("should click on Add button on the right hand side", function  () {
      return browser
        .elementByCss('span.x-btn-button span.bmAdd').click();
    });
    
    it("should fill form with user data and submit", function  () {
      return browser
        .frame('createPanelIframe')
        .elementByCss('input[name=userName]').type('326588332')
        .elementByCss('input[name=password]').type('password')
        .elementByCss('input[name=confPassword]').type('password')
        .elementByCss('input[name=firstName]').type('Fred')
        .elementByCss('input[name=lastName]').type('Sellers')
        .elementByCss('input[name=email]').type('solnsengg@gmail.com')
        .elementByCss('input[name=createUser]').click();
    });
    
    it("should logout", function  () {
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
    
    it("should click OnBoarding link in My Widgets section", function  () {
      return browser
        .waitForElementByLinkText('OnBoarding', 10000).click();
    });

    it("should fill form with user data and submit", function  () {
      return browser
        .frame('AppShowFrame')
        .elementById('TaxIdDs').type('326588332')
        .elementById('EmailDs').type('solnsengg@gmail.com')
        .elementById('FirstNameDsStart').type('Fred')
        .elementById('LastNameDsStart').type('Sellers')
        .elementByCss('#combobox6 option[value="IFS Bank"]').click()
        .elementById('createButton').click()
        .sleep(2000);
    });
    
    it("should logout", function  () {
      return browser
        .frame()
        .elementByLinkText('Logout').click();
    });

    it("should log in as user '326588332'", function  () {
      return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("326588332.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("326588332.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();
    });

    it("should attempt to enter valid value", function  () {
      return browser
        .frame('TaskShowFrame')
        .waitForElementByCss('form[name=form] input[name=Tax_Id]').type('8332')
        .elementByCss('form[name=form] input[type=submit]').click();
    });
    
    it("should expand all sections", function  () {
      return browser
        .frame('TaskShowFrame')
        .elementByLinkText('Expand All').click();
    });
    
    it("should fill in Errors and Omissions form data", function  () {
      return browser
        .elementById('CarrierDs').type('Carrier1')
        .elementById('PolicyNumberDs').type('1111')
        .elementById('ClaimLimitDs').type('2222')
        .elementById('PolicyLimitDs').type('3333')
        .elementById('CertificateNumberDs').type('certificate123');
    }); 
    
    it("should fill in Payment Accounts form data", function  () {
      var format = 'MMM DD, YYYY 00:00';
      return browser
        .elementById('AccountHolderNameDs1').type('Fred Sellers')
        .elementById('BankNameDs1').type('Bank1')
        .elementById('BankRoutingNumberDs1').type('1111')
        .elementById('AccountNumberDs1').type('2222')
        .elementById('date_Time3_id-inputEl').type(Date.today().toFormat(format))
        .elementById('date_Time5_id-inputEl').type(Date.tomorrow().toFormat(format));
    });
    
    it("should fill in Legal Questions form data", function  () {
      return browser
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=Yes]').then(function(elements) {
          var clicked = new Array();
          for (var i = 0; i < elements.length; i++) {
            clicked.push(elements[i].click());
          }
          return Promise.all(clicked);
        });
    });
    
    it("should fill in Appointment Requests form data", function  () {
      return browser
        .elementByXPath('//div[@id="licensesBODsDiv"]//td[contains(text(), "Michigan")]/following::input[1]').click();
    });

    it("should collapse all sections", function  () {
      return browser
        .elementByLinkText('Collapse All').click()
        .elementByCss('#headerLeftAndNavigationSummary').text().should.eventually.include("7 of 7 steps")
        .frame();
    });

  });

// TC2
  describe("Enter data - Add / View Notes", function() {
    var mainWindow;
    
    it("should click on Notes button and open Notes dialog", function () {
      return browser
        .frame('TaskShowFrame')
        .windowHandle().then(function(handle) {
          mainWindow = handle;
        })
        .elementByLinkText('Notes').click()
        .windowHandles().then(function(handles) {
          handles.forEach(function(handle) {
            if (handle !== mainWindow) {
              return browser.window(handle);
            }
          });
        });
    });
    
    it("should enter first note", function () {
      return browser
        .elementByCss('textarea#notes').type("first note by Fred Sellers")
        .elementByCss('input#add').click()
        .elementByCss('textarea#latestNote').text()
        .should.eventually.include("Activity: EnterDataAndUploadDocs")
        .and.should.eventually.include("Provided By: 326588332")
        .and.should.eventually.include("Note : first note by Fred Sellers");
    });
    
    it("should enter second note", function () {
      return browser
        .elementByCss('textarea#notes').type("2nd note by Fred Sellers")
        .elementByCss('input#add').click()
        .elementByCss('textarea#latestNote').text()
        .should.eventually.include("Activity: EnterDataAndUploadDocs")
        .and.should.eventually.include("Provided By: 326588332")
        .and.should.eventually.include("Note : 2nd note by Fred Sellers");
    });
    
    it("should close and reopen Notes dialog", function () {
      return browser
        .elementByCss('input#close').click()
        .window(mainWindow)
        .frame('TaskShowFrame')
        .elementByLinkText('Notes').click()
        .windowHandles().then(function(handles) {
          handles.forEach(function(handle) {
            if (handle !== mainWindow) {
              return browser.window(handle);
            }
          });
        })
        .elementByCss('textarea#latestNote').text()
        .should.eventually.include("Activity: EnterDataAndUploadDocs")
        .and.should.eventually.include("Provided By: 326588332")
        .and.should.eventually.include("Note : 2nd note by Fred Sellers");
    });
    
    it("should click Show All Notes and verify", function () {
      return browser
        .elementByLinkText('Show All Notes').click()
        .waitForElementByXPath('//td[normalize-space(text())="All Notes:"]/following-sibling::td').text()
        .should.eventually.contain("first note by Fred Sellers")
        .and.should.eventually.contain("2nd note by Fred Sellers");
    });
    
    it("should click Hide All Notes and verify", function () {
      return browser
        .elementByLinkText('Hide All Notes').click().sleep(100)
        .elementByXPath('//td[normalize-space(text())="All Notes:"]/following-sibling::td').isDisplayed()
        .should.eventually.be.false;
    });
    
    it("should close dialog and click Submit", function () {
      return browser
        .elementByCss('input#close').click()
        .window(mainWindow)
        .frame('TaskShowFrame')
        .elementByCss('input[value=Submit]').click();
    });

  });

// TC3
  describe("Upload documents", function() {
    
    it("should click Upload Documents section header", function () {
      return browser
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementById('uploadDocumentsHeader').click();
    });
    
    it("should upload W-9", function () {
      return browser
        .elementByXPath('//td[normalize-space(text())="W-9"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/test.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click();
    });
    
    it("should upload Proof of E & O", function () {
      return browser
        .elementByXPath('//td[normalize-space(text())="Proof of E & O"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/test.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click();
    });
        
    it("should upload License", function () {
      return browser
        .elementByXPath('//td[normalize-space(text())="License"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/test.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click();
    });
    
    it("should upload Direct Deposit", function () {
      return browser
        .elementByXPath('//td[normalize-space(text())="Direct Deposit"]/following-sibling::td/input').click()
        .waitForElementByCss('form#uploadFile input[type=file]').sendKeys(__dirname + "/files/test.docx")
        .elementByCss('form#uploadFile input[value=Upload]').click();
    });

    it("should click E-Sign Documents section header", function () {
      return browser
        .elementById('eSignDocumentsHeader').click();
    });
    
    it("should select checkboxes", function () {
      return browser
        .elementsByCss('input[name=eSignDocCheckbox]').then(function(elements) {
          var results = new Array();
          for (var i=0; i<elements.length; i++) {
            results.push(elements[i].click());
          }
          return Promise.all(results);
        });
    });
    
    it("should sign and click Submit", function () {
      return browser
        .elementByCss('input#eSignDs').type("Fred Sellers")
        .elementByLinkText('Collapse All').click()
        // TODO:Sign button?
        .elementByCss('input[value=Submit]').click();
    });
    
  });
  
});
