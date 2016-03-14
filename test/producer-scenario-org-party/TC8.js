var common = require("../common");
var config = common.config;
var browser = common.browser;

var dcmUrl = config.get("dcm.url");

it("Create child position in DCM", function() {

    var selectSubpageFrame0 = function() {
        return browser.frame().frame("container").frame("cacheframe0").frame("subpage");
    };

    var selectSubpageFrame1 = function() {
        return browser.frame().frame("container").frame("cacheframe1").frame("subpage");
    };

    var selectProppageFrame0 = function() {
        return browser.frame().frame("container").frame("cacheframe0").frame("proppage");
    };

    var selectProppageFrame1 = function() {
        return browser.frame().frame("container").frame("cacheframe1").frame("proppage");
    };

    return browser
        // Load login page
        .get(dcmUrl)

        // Log in as user 'sa'
        .elementByCss('form[name=LoginForm] input[name=LOGINNAME]').type(config.get("sa.username"))
        .elementByCss('form[name=LoginForm] input[name=PASSWORD]').type(config.get("sa.password"))
        .elementByCss('form[name=LoginForm] input[type=SUBMIT]').click()

        // Navigate to Party -> Party, select Search For Organization and click on Create Organization
        .frame("navbar")
        .waitForElementByCss('a#Party').click()
        .then(selectSubpageFrame0)
        .waitForElementByCss('#Search_Person_Main_primary_display_div select option[value=Menu_Party_Org]').click()
        .then(selectSubpageFrame0)
        .waitForElementById('Button_Org_Main_NewOrg').click()

        // Enter organization details
        .then(selectProppageFrame0)
        .waitForElementByCss('input[name="Party.Name"]').type("org1")
        .elementByCss('input[name="Party.TaxID"]').type("123456789")
        .elementByCss('select[name=SyncPDB] option[value=No]').click()
        .elementByCss('input[name=RoleDISTRIBUTOR]').click()
        .elementByCss('input[name="ContactPoint.Address.Street1"]').type("Street1")
        .elementByCss('input[name="ContactPoint.Address.City"]').type("New York")
        .elementByCss('select[name=US_State] option[value="New York State"]').click()
        .elementByCss('input[name=ZipCode]').type("12345")
        .elementByCss('a#save').click()
        .sleep(1000)

        // Go to Agreements, select agreement with ID AG3 and click Add One Agr. Member
        .frame()
        .frame("navbar")
        .waitForElementByCss('a[id="Compensation Setup"]').moveTo()
        .elementByCss('a#Agreement_sub').click()
        .then(selectSubpageFrame1)
        .waitForElementById('Search_Agreement_Main_SearchFormDiv')
        .elementByLinkText('>', 'Search').click()
        .elementByXPath('//table[@id="Grid_Agreement_Main"]//td[normalize-space(text())="AG3"]').click()
        .elementById('Tab_Agreement_Main_Membership_link').click()
        .frame('component_iframe')
        .waitForElementById('Button_Agreement_Main_Membership_AddOne').click()

        // Select organization Org1
        .then(selectProppageFrame0)
        .waitForElementById('searchPartySearchPage_search_div').click()
        .frame('PartySearchPage_search_div_frame')
        .waitForElementByCss('input#Query[value=PresetQuery_Party_Organization]').click()
        .elementById('Field_Party_Organization_NameUpper_Search_Value').type("o*")
        .elementByCss('div#Search_Party_SearchFormDiv')
        .elementByLinkText('>', 'Search').click()
        .waitForElementByXPath('//table[@id="Grid_Party"]//td[normalize-space(text())="org1"]').click()
        .elementById('Button_PartySearch_PP_Select').click().sleep(200)
        .elementById('save').click()

        // Go to Comp Hier Search, select Hierarchy for kit CK3 and click View in Hierarchy
        .frame()
        .frame("navbar")
        .waitForElementByCss('a[id=Hierarchy]').moveTo()
        .elementByCss('a#AgrHierarchySearch_sub').click()
        .then(selectSubpageFrame0)
        .waitForElementById('Search_AgrHierarchySearch_Main_SearchFormDiv')
        .elementByLinkText('>', 'Search').click()
        .elementByXPath('//table[@id="Grid_AgrHierarchySearch_Main"]//td[normalize-space(text())="Hierarchy for kit CK3"]').click()
        .frame('component_iframe')
        .elementById('Button_AgrHierarchySearchTree_ViewInHierarchy').click()
        .then(selectSubpageFrame1)
        .waitForElementById('AgrHierarchyOverviewOccupiedChildren_link').click()
        .frame('component_iframe')
        .waitForElementById('Button_OccupiedChildren_AddPosition').click()

        // Select organization Org1
        .then(selectProppageFrame1)
        .waitForElementByCss('input#Name').type("ChildPosition1")
        .elementById('searchParticipantSearchPage_search_div').click()
        .frame('ParticipantSearchPage_search_div_frame')
        .waitForElementByCss('input#Query[value=PresetQuery_Party_Organization]').click()
        .elementById('Field_Party_Organization_NameUpper_Search_Value').type("o*")
        .elementByCss('div#Search_Participant_SearchFormDiv')
        .elementByLinkText('>', 'Search').click()
        .waitForElementByXPath('//table[@id="Grid_Participant"]//td[normalize-space(text())="org1"]').click()
        .elementById('Button_ParticipantSearch_PP_Select').click().sleep(200)
        .elementById('save').click()
        .sleep(1000)

        // Log out
        .frame()
        .frame("navbar")
        .elementByLinkText('Logout').click();

});
