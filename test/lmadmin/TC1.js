var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Create LMAdmin instance", function () {

    var xPath = '//table[@role="presentation"]//tr/td/div[normalize-space(text())="LMAdmin"]' +
        '/ancestor::tr/td/div[normalize-space(text())="Specify Letter Details"]';

    return browser
        // Load login page
        .get(url)

        // Log in as user 'ebms'
        .login('ebms')

        // Click on Applications tab
        .waitForElementByLinkText('Applications', 10000).click()

        // Click on LMAdmin in Application Name column
        .waitForElementByLinkText('LMAdmin').click()

        // Click on Create button
        .frame('AppShowFrame')
        .waitForElementByCss('a#bizsite_completeTask_CREATE_LABEL_id').click()
        .frame('TaskShowFrame')
        .waitForElementById('appNamesCombo')

        // Click on My Worksteps tab and verify
        .frame()
        .elementByLinkText('My Worksteps').click()
        .waitForElementByXPath(xPath);

});