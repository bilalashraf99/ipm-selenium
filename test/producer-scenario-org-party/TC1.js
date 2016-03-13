var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Initiate New Onboarding process", function() {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'ebms'
        .login('ebms')

        // Navigate to User Management under Administration tab and click Add button
        .waitForElementByLinkText('Administration', 10000).click()
        .waitForElementByLinkText('User Management', 10000).click()
        .elementByCss('span.x-btn-button span.bmAdd').click()

        // Fill form with user data and submit
        .frame('createPanelIframe')
        .elementByCss('input[name=userName]').type('371494996')
        .elementByCss('input[name=password]').type('password')
        .elementByCss('input[name=confPassword]').type('password')
        .elementByCss('input[name=firstName]').type('National Benefits Group Llc')
        .elementByCss('input[name=lastName]').type('Dba Greenway Financial')
        .elementByCss('input[name=email]').type('solnsengg@gmail.com')
        .elementByCss('input[name=createUser]').click()

        // Log out
        .frame()
        .elementByLinkText('Logout').click()

        // Log in as user 'AnalystUser1'
        .login('analyst')

        .initiateOrganizationOnboarding('371494996', 'solnsengg@gmail.com', 'National Benefits Group Llc Dba Greenway Financial', 'IFS Bank', false, true)

        //// Click OnBoarding link in My Widgets section
        //.waitForElementByLinkText('OnBoarding', 10000).click()
        //
        //// Fill form with organization data and submit
        //.frame('AppShowFrame')
        //.sleep(1000) // Fix for issue where fields get cleared while driver is typing
        //.waitForElementByCss('select#combobox1 option[value=Organization]').click()
        //.elementById('TaxIdDs').type('020258767')
        //.elementById('EmailDs').type('solnsengg@gmail.com')
        //.elementById('OrganizationNameDsStart').type('Willis Of New Hampshire Inc')
        //.elementByCss('select#combobox6 option[value="IFS Bank"]').click()
        //.elementById('createButton').click()
        //.waitForElementById('dashboardPanel', 5000)

        // WAIT
        .sleep(8000)

        .verifyNewCase('371494996', 'National Benefits Group Llc Dba Greenway Financial')

        // Click on Dashboard tab and check new case among search results
        //.frame()
        //.elementByLinkText('Dashboard', 10000).click()
        //.waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
        //.waitForElementByCss('input#case_searchText').type('020258767')
        //.waitForElementByCss('input#case_search').click()
        //.waitForElementByXPath("//*[@id='case_SearchResults']/descendant::td[@data-qtip='020258767']/parent::tr/child::td[@data-qtip='Willis Of New Hampshire Inc']/parent::tr/child::td[@data-qtip='ACTIVATED']", 10000)

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
