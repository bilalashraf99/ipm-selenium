var config = require('nconf');
config.file({file: './test/config.json'});

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

var url = config.get("ipm.url");

var http = require('http');
var fs = require('fs');

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

// TC13
  describe("Send response to BIG and NIPR and complete flow", function() {
    
    var instanceId;

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
    
    it("should click on My Worksteps tab and get instance number", function  () {
      return browser
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementById('assignedDate').click().sleep(500).click()
        .waitForElementByXPath('//div[contains(text(), "020258767")]').text().then(function(result) {
          var len = result.length;
          instanceId = result.substring(len-5, len-1);          
          console.log(instanceId);
        });
    });
    
    var postJson = function(fileName, path) {
      fs.readFile(fileName, 'utf-8', function(err, data) {
        if (err) {
          console.log("Error reading file!");
        }
        if (data) {
          var options = {
            hostname: '172.30.89.191',
            port: 18793,
            path: path,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(data.length)
            }
          };
          
          var postRequest = http.request(options, function(res) {
            res.on('data', function (chunk) {
              console.log('Response: ' + chunk);
            });
          });
          
          data.replace('<InstanceID>', instanceId);
          postRequest.write(data);
          postRequest.end();
        }
      });
    };
    
    //TODO: Promisify
    it("should send response for BIG", function  () {
      return Promise.resolve(postJson('BIG_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse'));
    });

    //TODO: Promisify    
    it("should send response for NIPR", function  () {
      return Promise.resolve(postJson('NIPR_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse'));
    });
    
    it("should click on Dashboard tab and verify search results", function  () {
      return browser
        .frame()
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('input#case_search').click()
        .waitForElementByXPath("//*[@id='case_SearchResultsDefault']/descendant::td[@data-qtip='020258767']/parent::tr/child::td[@data-qtip='Willis Of New Hampshire Inc']/parent::tr/child::td[@data-qtip='COMPLETED']", 10000)
        .elementByCss('input#search').click()
        .waitForElementByXPath("//*[@id='SearchResults']/descendant::td[@data-qtip='020258767']/parent::tr/descendant::div[normalize-space(text())='Approval']")
        .elementByXPath("//*[@id='SearchResults']/descendant::td[@data-qtip='020258767']/parent::tr/descendant::div[normalize-space(text())='ReviewTaxIdVerification']")
        .elementByXPath("//*[@id='SearchResults']/descendant::td[@data-qtip='020258767']/parent::tr/descendant::div[normalize-space(text())='Select Upline']");
    });

  });
  
});
