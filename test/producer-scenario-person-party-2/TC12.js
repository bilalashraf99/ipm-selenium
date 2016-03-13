var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("View Workflow", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Perform Advanced case search for tax ID
        .waitForElementByCss('input#case_advSearch').click()
        .elementByCss('input#case_txtTaxId').type("067600492")
        .elementByCss('#searchCaseFiltersDiv input[value=Search]').click()
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#searchCaseFiltersDiv input#case_workFlow').click()
        .waitForElementByCss('iframe#actionHandler')
        .frame('actionHandler')
        .frame('psv')
        .elementById('resultPanel_header_hd-textEl').text().should.eventually.include("Process Status Viewer - John--067600492")

        // Close PSV window and log out
        .frame()
        .elementByCss('img.x-tool-close').click()
        .elementByLinkText('Logout').click()

        // Log in as user 'ManagerUser1'
        .login('manager')

        // Perform Advanced case search for tax ID
        .waitForElementByCss('input#case_advSearch').click()
        .elementByCss('input#case_txtTaxId').type("067600492")
        .elementByCss('#searchCaseFiltersDiv input[value=Search]').click()
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#searchCaseFiltersDiv input#case_workFlow').click()
        .waitForElementByCss('iframe#actionHandler')
        .frame('actionHandler')
        .frame('psv')
        .elementById('resultPanel_header_hd-textEl').text().should.eventually.include("Process Status Viewer - John--067600492")

        // Close PSV window and log out
        .frame()
        .elementByCss('img.x-tool-close').click()
        .elementByLinkText('Logout').click();

});
