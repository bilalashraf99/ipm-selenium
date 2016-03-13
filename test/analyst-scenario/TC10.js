var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

it("Create instance - Org", function () {

    var selectSubpageFrame0 = function() {
        return browser.frame().frame("container").frame("cacheframe0").frame("subpage");
    };

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        .initiateOrganizationOnboarding('020258767', 'solnsengg@gmail.com', 'Willis Of New Hampshire Inc', 'LLIC', true, false)

        // Wait
        .sleep(8000)

        .verifyNewCase('020258767', 'Willis Of New Hampshire Inc')

        // Click on My Worksteps tab
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementByXPath('//div[normalize-space(text())="Enter Data & Review Docs"]/parent::td/following-sibling::td//a[normalize-space(text())="AnalystUser1"]')
        .catch(function() {
            return common.retry(10, function() {
                return browser
                    .sleep(8000)
                    .elementByCss('#instanceList a[data-qtip=Refresh]').click()
                    .waitForElementByXPath('//div[normalize-space(text())="Enter Data & Review Docs"]/parent::td/following-sibling::td//a[normalize-space(text())="AnalystUser1"]')
            });
        })

        // Log out
        .elementByLinkText('Logout').click()

        // Load DCM login page
        .get(dcmUrl)

        // Log in as user 'sa'
        .elementByCss('form[name=LoginForm] input[name=LOGINNAME]').type(config.get("sa.username"))
        .elementByCss('form[name=LoginForm] input[name=PASSWORD]').type(config.get("sa.password"))
        .elementByCss('form[name=LoginForm] input[type=SUBMIT]').click()

        // Navigate to Party -> Party
        .frame("navbar")
        .waitForElementByCss('a#Party').click()

        // Perform search on Tax ID
        .then(selectSubpageFrame0)
        .waitForElementByCss('#Search_Person_Main_primary_display_div select option[value=Menu_Party_Org]').click()
        .then(selectSubpageFrame0)
        .waitForElementByCss('input[name=Field_Org_Main_TaxID_Search_Value]').type('020258767')
        .elementByLinkText('Search').click()
        .waitForElementByCss('table[name=Grid_Org_Main] tbody td:nth-child(2)').text().should.eventually.match(/WILLIS OF NEW HAMPSHIRE INC/i)
        .elementByCss('table[name=Grid_Org_Main] tbody td:nth-child(4)').text().should.become('020258767')
        .elementByCss('table[name=Grid_Org_Main] tbody td:nth-child(11)').text().should.become('solnsengg@gmail.com')

        // Log out
        .frame()
        .frame("navbar")
        .elementByLinkText('Logout').click();

});
