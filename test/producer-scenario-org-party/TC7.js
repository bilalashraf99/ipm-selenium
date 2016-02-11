var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Approval - Approve action", function() {

    var approvalXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='020258767']/parent::tr/child::td[@data-qtip='Willis Of New Hampshire Inc']/parent::tr/descendant::a[normalize-space(text())='Approval']";

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
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()


        // Click on Approval task among search results
        .waitForElementByCss('select#searchField option[value=TAX_ID]', 5000).catch(function(e) {
            console.log(e);
            return browser.sleep(1000).waitForElementByCss('select#searchField');
        }).click()
        .elementByCss('input#searchText').type('020258767')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(approvalXPath)
        .catch(nested).click()

        // Verify updated Policy Type
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementByCss('#errorsAndOmissionsContentDiv select#EDUD_PolicyTypeDs').getValue().should.become('Bond')

        // Verify updated Account Holder Name
        .elementByCss('#paymentAccountsContentDiv input#EDUD_AccountHolderNameDs1').getValue().should.become('Willis of New Hampshire Inc')

        // Verify updated E-sign docs section
        .elementByCss('#eSignDocumentsContentDiv input#EDUD1_eSignDs').getValue().should.become('Willis of New Hampshire Inc')

        // Click on Approve
        .waitForElementByCss('input[value=Approve]').click()
        .waitForElementByCss('iframe', 10000)
        .frame('TaskShowFrame')
        .waitForElementById('midPanelHeader').text().should.eventually.include("Select Up-line")

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});