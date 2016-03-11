var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("My Tasks widget - Basic search", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Search based on Task Name
        .waitForElementByCss('select#searchField option[value=TASK_NAME]').click()
        .elementByCss('input#searchText').type('Review')
        .elementByCss('input#search').click()
        .sleep(1000)
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(1)

        // Search based on Type
        .waitForElementByCss('select#searchField option[value=TYPE]').click()
        .elementByCss('input#searchText').clear().type('OnBoarding')
        .elementByCss('input#search').click()
        .sleep(1000)
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(1)

        // Search based on Status
        .waitForElementByCss('select#searchField option[value=STATUS]').click()
        .elementByCss('input#searchText').clear().type('ASSIGNED')
        .elementByCss('input#search').click()
        .sleep(1000)
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(1)

        // Search based on Tax ID
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').clear().type('067600492')
        .elementByCss('input#search').click()
        .sleep(1000)
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(1)

        // Search based on Name
        .waitForElementByCss('select#searchField option[value=NAME]').click()
        .elementByCss('input#searchText').clear().type('John')
        .elementByCss('input#search').click()
        .sleep(1000)
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(1)

        // Click on Dashboard tab
        .frame()
        .elementByLinkText('Dashboard', 10000).click()

        // Log out
        .elementByLinkText('Logout').click();

});
