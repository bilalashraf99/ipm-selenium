var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Select Upline - Org", function() {

    var mainWindow;

    var selectMainWindow = function() {
        return browser.window(mainWindow);
    };

    var selectChildWindow = function() {
        return browser.windowHandles().then(function(handles) {
            handles.forEach(function(handle) {
                if (handle !== mainWindow) {
                    return browser.window(handle);
                }
            });
        });
    };

    return browser
        // Click 'Select Parent Position'
        .windowHandle().then(function(handle) {
            mainWindow = handle;
        })
        .elementById('childPositionTextBox').type("ChildPosition1")
        .waitForElementById('SelectParentPosition').click()
        .then(selectChildWindow)
        .waitForElementById('firstNameTextBox', 5000).type("F")
        .elementByCss('input[value=Search]').click()
        .waitForElementById('selectUplineSearchTable', 5000)
        .elementByXPath('//td[normalize-space(text())="FirstName1"]/preceding-sibling::td/input').click()
        .elementByCss('input[value=Submit]').click()
        .then(selectMainWindow)
        .frame('TaskShowFrame')
        .waitForElementById('parentPositionTextBox').getValue().should.become("ParentPosition")

        // Verify dynamic fields
        .elementByCss('input[name=newOrExistingPositionRadio][value="Existing Position"]').click()
        .waitForElementByCss('a#SelectChildPosition').click()
        .then(selectChildWindow)
        .elementById('searchByOrganizationRadio').click()
        .elementById('organizationNameTextBox').type("o")
        .elementByCss('input[value=Search]').click()
        .waitForElementById('selectUplineSearchTable', 5000)
        .elementByXPath('//td[normalize-space(text())="ORG1"]/preceding-sibling::td/input').click()
        .elementByCss('input[value=Submit]').click()
        .then(selectMainWindow)
        .frame('TaskShowFrame')
        .waitForElementById('childPositionTextBox').getValue().should.become("ChildPosition1")

        // Click on Submit button
        .elementByCss('input[value=Submit]').click();

});
