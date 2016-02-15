var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Login using new onboarded organization", function() {

    return browser
        // Load login page
        .get(url)

        // Log in as user '020258767'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("020258767.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("020258767.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click on Search icon in My Tasks widget and verify results
        .elementByCss('input#search').click()
        .waitForElementByXPath('//*[@id="SearchResults"]//td[@data-qtip="Verify Tax ID"]/parent::tr//td[@data-qtip="COMPLETED"]')
        .elementByXPath('//*[@id="SearchResults"]//td[@data-qtip="EnterDataAndUploadDocs"]/parent::tr//td[@data-qtip="COMPLETED"]')
        .elementByXPath('//*[@id="SearchResults"]//td[@data-qtip="UploadDocsAndESign"]/parent::tr//td[@data-qtip="COMPLETED"]')

        // Click on Dashboard and check Workflow initiation links
        .elementByLinkText('Dashboard').click()
        .waitForElementByCss('div#myWidgetDiv').elementByLinkText('>', 'AddAppointment')
        .elementByCss('div#myWidgetDiv').elementByLinkText('>', 'OnBoarding');

});
