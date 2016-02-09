var common = require("../common");
var path = require("path");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("View / Edit Documents", function () {

    // Load login page
    var step1 = browser
        .get(url);

    // Log in as user 'AnalystUser1'
    var step2 = step1
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click();

    // Select radio button for John Blumberg under My Widgets
    var step3 = step2
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
        .and.should.eventually.include("GeneralAgreement.pdf");

    // Upload in RequiredDocs section
    var step4 = step3
        .elementByCss('fieldset#RequiredDocs button[name=addNew]').click()
        .waitForElementByCss('input#uploadFilesID').sendKeys(path.join(__dirname, "../../files", "Welcome.docx"))
        .elementByCss('input[value=Upload]').click()
        .waitForElementByCss('fieldset#RequiredDocs a').text().should.become("Welcome.docx")
        .frame()
        .elementByCss('img.x-tool-close').click();

    // Select radio button for row where status is Activated and delete W-9
    var step5 = step4
//        .waitForElementByXPath('//*[@id="case_SearchResultsDefault"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#searchCaseFiltersDiv input#case_document').click()
        .waitForElementByCss('iframe#actionHandler')
        .frame('actionHandler')
        .waitForElementByCss('fieldset#RequiredDocs a', 5000).text().should.become("Welcome.docx") //?
        // TODO: Delete button should be clicked, but there is no Delete button!
        .frame()
        .elementByCss('img.x-tool-close').click();

    // Select radio button for row where status is Activated and verify deletion
    //var step6 = step5
    //    .waitForElementByXPath('//*[@id="case_SearchResultsDefault"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
    //    .elementByCss('#searchCaseFiltersDiv input#case_document').click()
    //    .waitForElementByCss('fieldset#ReloadDocs').text().should.eventually.not.include("W9.pdf")
    //    .elementByCss('img.x-tool-close').click();

    // Log out
    //return step6
    return step5
        .elementByLinkText('Logout').click();

});
