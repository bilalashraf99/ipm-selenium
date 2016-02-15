var common = require("../common");
var path = require("path");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("View / Edit Documents", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Select radio button for John Blumberg under My Widgets
        .waitForElementByCss('select#case_searchField option[value=NAME]').click()
        //.elementByCss('input#case_searchText').type("John Blumberg")
        .elementByCss('input#case_searchText').type("Nandan162016 Katz")
        .elementByCss('input#case_search').click()
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#searchCaseFiltersDiv input#case_document').click()
        .waitForElementByCss('iframe#actionHandler')
        .frame('actionHandler')
        .waitForElementByCss('fieldset#BCReport a', 5000).text().should.become("BCReport_Jan152013.docx")
        .elementByCss('fieldset#ReloadDocs a').text().should.become("W9.pdf")
        .elementByCss('fieldset#ESignDocs').text().should.eventually.include("CAAgreementAmendment.pdf")
        .and.should.eventually.include("GeneralAgreement.pdf")

        // Upload in RequiredDocs section
        .elementByCss('fieldset#RequiredDocs button[name=addNew]').click()
        .waitForElementByCss('input#uploadFilesID').sendKeys(path.join(__dirname, "../../files", "Welcome.docx"))
        .elementByCss('input[value=Upload]').click()
        .waitForElementByCss('fieldset#RequiredDocs a').text().should.become("Welcome.docx")
        .frame()
        .elementByCss('img.x-tool-close').click()

        // Select radio button for row where status is Activated and delete W-9
//        .waitForElementByXPath('//*[@id="case_SearchResultsDefault"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#searchCaseFiltersDiv input#case_document').click()
        .waitForElementByCss('iframe#actionHandler')
        .frame('actionHandler')
        .waitForElementByCss('fieldset#RequiredDocs a', 5000).text().should.become("Welcome.docx") //?
        // TODO: Delete button should be clicked, but there is no Delete button!
        .frame()
        .elementByCss('img.x-tool-close').click()

    // Select radio button for row where status is Activated and verify deletion
    //    .waitForElementByXPath('//*[@id="case_SearchResultsDefault"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
    //    .elementByCss('#searchCaseFiltersDiv input#case_document').click()
    //    .waitForElementByCss('fieldset#ReloadDocs').text().should.eventually.not.include("W9.pdf")
    //    .elementByCss('img.x-tool-close').click();

        // Log out
        .elementByLinkText('Logout').click();

});
