var common = require("../common");
var config = common.config;
var browser = common.browser;

var dcmUrl = config.get("dcm.url");

it("Verify organization party in DCM", function() {

    var selectSubpageFrame0 = function() {
        return browser.frame().frame("container").frame("cacheframe0").frame("subpage");
    };

    return browser
        // Load login page
        .get(dcmUrl)

        // Log in as user 'sa'
        .elementByCss('form[name=LoginForm] input[name=LOGINNAME]').type(config.get("sa.username"))
        .elementByCss('form[name=LoginForm] input[name=PASSWORD]').type(config.get("sa.password"))
        .elementByCss('form[name=LoginForm] input[type=SUBMIT]').click()

        // Navigate to Party -> Party, search for organization with tax ID 020258767
        .frame("navbar")
        .waitForElementByCss('a#Party').click()
        .then(selectSubpageFrame0)
        .waitForElementByCss('#Search_Person_Main_primary_display_div select option[value=Menu_Party_Org]').click()
        .then(selectSubpageFrame0)
        .waitForElementById('Field_Org_Main_TaxID_Search_Value').type("371494996")
        .elementByLinkText('Search').click()
        .waitForElementByCss('table#Grid_Org_Main tbody tr').text().should.eventually.include("NATIONAL BENEFITS")

        // Verify Agreements
        .elementById('Tab_Org_Main_Agreements_link').click()
        .frame('component_iframe')
        .waitForElementByCss('table#Grid_Org_Main_Agreements tbody').text().should.eventually.include("AG-CK5")
        .and.should.eventually.include("AG-CK4").and.should.eventually.include("AG-CK3")

        // Verify Licenses
        .then(selectSubpageFrame0)
        .elementById('Tab_Org_DistributorData_Main_Licenses_link').click()
        .frame('component_iframe')
        .waitForElementsByCss('table#Grid_Org_DistributorData_Main_Licenses tbody tr').then(function(elements) {
            return elements.should.have.length.above(0);
        })
        // Verify Continuing Education
        .then(selectSubpageFrame0)
        .elementById('Tab_Org_DistributorData_Main_CE_link').click()
        .frame('component_iframe')
        .waitForElementByCss('table#Grid_Org_DistributorData_Main_CE tbody').text().should.eventually.include("AML Training for Organization")
        .and.should.eventually.include("Model Law Training for Organization")

        // Verify EO coverage
        .then(selectSubpageFrame0)
        .elementById('Tab_Org_DistributorData_Main_EO_link').click()
        .frame('component_iframe')
        .waitForElementsByCss('table#Grid_Org_DistributorData_Main_EO tbody tr').then(function(elements) {
            return elements.should.have.length.above(0);
        })

        // Log out
        .frame()
        .frame("navbar")
        .elementByLinkText('Logout').click();

});
