var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Approval - Approve action", function() {

    var approvalXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='371494996']/parent::tr/child::td[@data-qtip='National Benefits Group Llc Dba Greenway Financial']/parent::tr/descendant::a[normalize-space(text())='Approval']";

    var nested = function(e) {
        return browser
            .waitForElementByCss('#SearchResults a[data-qtip="Next Page"]:not(.x-btn-disabled)').then(function(ref){
                return ref.click()
                    .waitForElementByXPath(approvalXPath)
                    .catch(nested);
            });
    };

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Click on Approval task among search results
        .waitForElementByCss('select#searchField option[value=TAX_ID]', 5000).catch(function(e) {
            console.log(e);
            return browser.sleep(1000).waitForElementByCss('select#searchField');
        }).click()
        .elementByCss('input#searchText').type('371494996')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(approvalXPath)
        .catch(nested).click()

        // Verify updated Policy Type
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementByCss('#errorsAndOmissionsContentDiv select#EDUD_PolicyTypeDs').getValue().should.become('Bond')

        // Verify updated Account Holder Name
        .elementByCss('#paymentAccountsContentDiv input#EDUD_AccountHolderNameDs1').getValue().should.become('National Benefits Group Llc Dba Greenway Financial')

        // Verify updated E-sign docs section
        .elementByCss('#eSignDocumentsContentDiv input#EDUD1_eSignDs').getValue().should.become('National Benefits Group Llc Dba Greenway Financial')

        // Click on Approve
        .waitForElementByCss('input[value=Approve]').click()
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementById('midPanelHeader').text().should.eventually.include("Select Up-line")

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});