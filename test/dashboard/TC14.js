var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("My Widgets - Basic search", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'ManagerUser1'
        .login('manager')

        // Search based on Case Name
        .waitForElementByCss('select#case_searchField option[value=CASE_NAME]', 10000).click()
        .elementByCss('select#case_OPERATOR option[value=LIKE]').click()
        .elementByCss('input#case_searchText').type('Willis')
        .elementByCss('input#case_search').click()
        .sleep(1000)
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Search based on Type
        .waitForElementByCss('select#case_searchField1 option[value=TYPE]').click()
        .elementByCss('select#case_OPERATOR1 option[value=IS]').click()
        .elementByCss('input#case_searchText1').clear().type('OnBoarding')
        .elementByCss('#case_basicSearchDiv input#case_search').click()
        .sleep(1000)
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(3)

        // Search based on Status
        .waitForElementByCss('select#case_searchField1 option[value=STATUS]').click()
        .elementByCss('select#case_OPERATOR1 option[value=NOT]').click()
        .elementByCss('input#case_searchText1').clear().type('PI_REMOVED')
        .elementByCss('#case_basicSearchDiv input#case_search').click()
        .sleep(1000)
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(1)

        // Search based on Tax ID
        .waitForElementByCss('select#case_searchField1 option[value=TAX_ID]').click()
        .elementByCss('select#case_OPERATOR1 option[value=LIKE]').click()
        .elementByCss('input#case_searchText1').clear().type('02')
        .elementByCss('#case_basicSearchDiv input#case_search').click()
        .sleep(1000)
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(1)

        // Search based on Name
        .waitForElementByCss('select#case_searchField1 option[value=NAME]').click()
        .elementByCss('select#case_OPERATOR1 option[value=NOT_LIKE]').click()
        .elementByCss('input#case_searchText1').clear().type('FR')
        .elementByCss('#case_basicSearchDiv input#case_search').click()
        .sleep(1000)
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(3)

        // Log out
        .elementByLinkText('Logout').click();

});
