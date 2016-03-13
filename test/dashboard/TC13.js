var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("My Tasks widget - Advanced search", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Open Advanced Search
        .waitForElementByCss('input#advSearch').click()

        // Search based on Task Name
        .waitForElementByCss('select#selTaskName option[value=EnterDataAndReviewDocs]').click()
        .elementByCss('input[value=Search]').click()
        .sleep(1000)
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(1)

        // Search based on Case Owner Worker
        .elementByCss('input[value=Reset]').click()
        .elementByCss('select#selCaseOwner option[value=Analyst]').click()
        .elementByCss('input[value=Search]').click()
        .sleep(1000)
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(1)

        // Search based on Task Status
        .elementByCss('input[value=Reset]').click()
        .elementByCss('select#selStatus option[value=ASSIGNED]').click()
        .elementByCss('input[value=Search]').click()
        .sleep(1000)
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length.of.at.least(1)

        // Search based on Activity Type
        .elementByCss('input[value=Reset]').click()
        .elementByCss('select#selAppName option[value="15"]').click()
        .elementByCss('input[value=Search]').click()
        .sleep(1000)
        .elementByCssOrNull('div#SearchResults table[role=presentation] tr').should.eventually.be.null

        // Search based on multiple values
        .elementByCss('select#selTaskName option[value=EnterDataAndReviewDocs]').click()
        .elementByCss('select#selCaseOwner option[value=AnalystUser1]').click()
        .elementByCss('select#selStatus option[value=COMPLETED]').click()
        .elementByCss('input#txtName').type("WATSON FINANCIAL SERVICES INC")
        .elementByCss('input#txtTaxId').type("208949993")
        .elementByCss('input[value=Search]').click()
        .sleep(1000)
        .elementByCssOrNull('div#SearchResults table[role=presentation] tr').should.eventually.be.null

        // Clear Activity Type selection and search
        .elementByCss('select#selAppName option[value=NO_SELECTION]').click()
        .elementByCss('input[value=Search]').click()
        .sleep(1000)
        .waitForElementsByCss('div#SearchResults table[role=presentation] tr').should.eventually.have.length(1)

        // Log out
        .elementByLinkText('Logout').click();

});
