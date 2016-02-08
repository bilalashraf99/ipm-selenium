var config = require('nconf');
config.file({file: './test/config.json'});

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

// TC12
    describe("View Workflow", function() {

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

        it("should perform Advanced case search for tax ID", function  () {
            return browser
                .waitForElementByCss('input#case_advSearch').click()
                .elementByCss('input#case_txtTaxId').type("067600492")
                .elementByCss('#searchCaseFiltersDiv input[value=Search]').click()
                .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
                .elementByCss('#searchCaseFiltersDiv input#case_workFlow').click()
                .waitForElementByCss('iframe#actionHandler')
                .frame('actionHandler')
                .frame('psv')
                .elementById('resultPanel_header_hd-textEl').text().should.eventually.include("Process Status Viewer - John--067600492");
        });

        it("should close PSV window and log out", function  () {
            return browser
                .frame()
                .elementByCss('img.x-tool-close').click()
                .elementByLinkText('Logout').click();
        });

        it("should log in as user 'ManagerUser1'", function  () {
            return browser
                .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("manager.username"))
                .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("manager.password"))
                .elementByCss('form[name=loginForm] input[type=submit]').click();
        });

        it("should perform Advanced case search for tax ID", function  () {
            return browser
                .waitForElementByCss('input#case_advSearch').click()
                .elementByCss('input#case_txtTaxId').type("067600492")
                .elementByCss('#searchCaseFiltersDiv input[value=Search]').click()
                .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
                .elementByCss('#searchCaseFiltersDiv input#case_workFlow').click()
                .waitForElementByCss('iframe#actionHandler')
                .frame('actionHandler')
                .frame('psv')
                .elementById('resultPanel_header_hd-textEl').text().should.eventually.include("Process Status Viewer - John--067600492");
        });

        it("should close PSV window and log out", function  () {
            return browser
                .frame()
                .elementByCss('img.x-tool-close').click()
                .elementByLinkText('Logout').click();
        });

    });

});
