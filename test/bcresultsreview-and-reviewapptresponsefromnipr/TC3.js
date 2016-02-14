var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Select Upline", function() {

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
        .frame('TaskShowFrame')
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
        .elementById('childPositionTextBox').type("ChildPosition1")
        .elementByCss('select#positionTypeCombo option[value=Producer]').click()

        // Click on Submit button
        .elementByCss('input[value=Submit]').click()

        // Log out
        .frame()
        .waitForElementById('dashboardPanel-body')
        .elementByLinkText('Logout').click();

});
