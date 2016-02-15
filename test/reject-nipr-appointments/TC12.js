var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;
var dcmUrl = config.get("dcm.url");

it("Edit Organization in DCM", function () {

    var selectSubpageFrame0 = function() {
        return browser.frame().frame("container").frame("cacheframe0").frame("subpage");
    };

    var selectProppageFrame0 = function() {
        return browser.frame().frame("container").frame("cacheframe0").frame("proppage");
    };

    return browser
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
        .waitForElementByCss('table[name=Grid_Org_Main] tbody td:nth-child(2)').text().should.become('Willis Of New Hampshire Inc')
        .elementByCss('table[name=Grid_Org_Main] tbody td:nth-child(4)').text().should.become('020258767')
        .elementByCss('table[name=Grid_Org_Main] tbody td:nth-child(11)').text().should.become('solnsengg@gmail.com')

        // Edit Basic Info
        .frame('component_iframe')
        .elementById('Button_Org_Main_BasicInfo_Edit').click()
        .then(selectProppageFrame0)
        .elementById('Party.Name').clear().type('aaaa')
        .elementById('Party.TaxID').clear().type('1111')
        .elementByCss('select#SyncPDB option[value=No]').click()
        .elementByCss('a#save').click()
        .sleep(2000)

        // Log out
        .frame()
        .frame("navbar")
        .elementByLinkText('Logout').click();

    //// Load login page
    //.get(url)
    //
    //// Log in as user 'AnalystUser1'
    //    .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
    //    .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
    //    .elementByCss('form[name=loginForm] input[type=submit]').click()

});
