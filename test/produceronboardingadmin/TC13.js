var common = require("../common");
var browser = common.browser;

it("Approval - Escalate for organization party", function () {

    var approvalXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='020258767']/parent::tr/child::td[@data-qtip='Willis of New Hampshire Inc']/parent::tr/descendant::a[normalize-space(text())='Approval']";

    var nested = function(e) {
        return browser
            .elementByCss('#SearchResults a[data-qtip="Next Page"]:not(.x-btn-disabled)').then(function(ref){
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

        // Click on new Approval task among search results
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('020258767')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(approvalXPath)
        .catch(nested).click()

        // Click on Escalate button
        .frame('AppShowFrame')
        .elementByCss('input[type=submit][value=Escalate]').click()

        // Verify
        .frame()
        .frame('TaskShowFrame')
        .waitForElementByCss('#resultDiv').text().should.become("Data To Approve")
        .elementByCss('textarea#txaPreComm').getValue().should.eventually.include("AnalystUser1 : Escalated : No Comments..")

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
