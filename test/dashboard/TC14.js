var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("My Widgets - Basic search", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'ManagerUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("manager.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("manager.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Search based on Case Name
        .waitForElementByCss('select#case_searchField option[value=CASE_NAME]').click()
        .elementByCss('select#case_OPERATOR option[value=LIKE]').click()
        .elementByCss('input#case_searchText').type('Willis')
        .elementByCss('input#case_search').click()
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Search based on Type
        .waitForElementByCss('select#case_searchField1 option[value=TYPE]').click()
        .elementByCss('select#case_OPERATOR1 option[value=IS]').click()
        .elementByCss('input#case_searchText1').clear().type('OnBoarding')
        .elementByCss('#case_basicSearchDiv input#case_search').click()
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(3)

        // Search based on Status
        .waitForElementByCss('select#case_searchField1 option[value=STATUS]').click()
        .elementByCss('select#case_OPERATOR1 option[value=NOT]').click()
        .elementByCss('input#case_searchText1').clear().type('PI_REMOVED')
        .elementByCss('#case_basicSearchDiv input#case_search').click()
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(2)

        // Search based on Tax ID
        .waitForElementByCss('select#case_searchField1 option[value=TAX_ID]').click()
        .elementByCss('select#case_OPERATOR1 option[value=LIKE]').click()
        .elementByCss('input#case_searchText1').clear().type('02')
        .elementByCss('#case_basicSearchDiv input#case_search').click()
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Search based on Name
        .waitForElementByCss('select#case_searchField1 option[value=NAME]').click()
        .elementByCss('select#case_OPERATOR1 option[value=NOT_LIKE]').click()
        .elementByCss('input#case_searchText1').clear().type('FR')
        .elementByCss('#case_basicSearchDiv input#case_search').click()
        .waitForElementsByCss('div#case_SearchResults table[role=presentation] tr').should.eventually.have.length(2)

        // Log out
        .elementByLinkText('Logout').click();

});
