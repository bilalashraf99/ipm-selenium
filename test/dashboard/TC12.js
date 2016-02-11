var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("My Tasks widget - Basic search", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Search based on Task Name
        .waitForElementByCss('select#searchField option[value=TASK_NAME]').click()
        .elementByCss('input#searchText').type('Review')
        .elementByCss('input#search').click()
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(4)

        // Search based on Type
        .waitForElementByCss('select#searchField option[value=TYPE]').click()
        .elementByCss('input#searchText').clear().type('LetterManager')
        .elementByCss('input#search').click()
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Search based on Status
        .waitForElementByCss('select#searchField option[value=STATUS]').click()
        .elementByCss('input#searchText').clear().type('ASSIGNED')
        .elementByCss('input#search').click()
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Search based on Tax ID
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').clear().type('067600492')
        .elementByCss('input#search').click()
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Search based on Name
        .waitForElementByCss('select#searchField option[value=NAME]').click()
        .elementByCss('input#searchText').clear().type('John')
        .elementByCss('input#search').click()
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Click on Dashboard tab
        .frame()
        .elementByLinkText('Dashboard', 10000).click()

        // Log out
        .elementByLinkText('Logout').click();

});
