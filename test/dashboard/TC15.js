var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("My Widgets - Advanced search", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'ManagerUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("manager.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("manager.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Open Advanced Search
        .waitForElementByCss('input#case_advSearch').click()

        // Search based on Task Case
        .waitForElementByCss('#case_selTaskName option[value^="Willis Of New Hampshire Inc--020258767#"]').click()
        .elementByCss('#case_advSearchDiv input[value=Search]').click()
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Search based on Case Owner Worker
        .elementByCss('#case_advSearchDiv input[value=Reset]').click()
        .elementByCss('#case_selCaseOwner option[value=AnalystUser1]').click()
        .elementByCss('#case_advSearchDiv input[value=Search]').click()
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Search based on Task Status
        .elementByCss('#case_advSearchDiv input[value=Reset]').click()
        .elementByCss('#case_selStatus option[value=PI_REMOVED]').click()
        .elementByCss('#case_advSearchDiv input[value=Search]').click()
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Search based on multiple values
        .elementByCss('#case_advSearchDiv input[value=Reset]').click()
        .elementByCss('#case_selCaseOwner option[value=AnalystUser1]').click()
        .elementByCss('#case_selStatus option[value=PI_ACTIVATED]').click()
        .elementByCss('input#case_txtName').type("John")
        .elementByCss('input#case_txtTaxId').type("067600492")
        .elementByXPath('//input[@id="case_selectedFromDateSTask"]/following-sibling::a').click()
        .elementByXPath('//div[@class="calendar" and contains(@style,"display: block")]//div[normalize-space(text())="Today"]').click()
        .elementByXPath('//input[@id="case_selectedToDateSTask"]/following-sibling::a').click()
        .elementByXPath('//div[@class="calendar" and contains(@style,"display: block")]//td[contains(@class,"today")]/following::td[not(contains(@class,"wn"))]').click()
        .elementByCss('#case_advSearchDiv input[value=Search]').click()
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Log out
        .elementByLinkText('Logout').click();

});
