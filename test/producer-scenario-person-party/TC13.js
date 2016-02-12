var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Select Upline", function () {

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
        .windowHandle().then(function(handle) {
            mainWindow = handle;
        })
        // Click 'Select Parent Position'
        .elementById('childPositionTextBox').type("ChildPosition1")
        .elementById('SelectParentPosition').click()
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
        .waitForElementByCss('a#SelectChildPosition').isVisible()
        .elementByCss('input[name=newOrExistingPositionRadio][value="New Position"]').click()
        .elementByCss('select#positionTypeCombo option[value=Producer]').click()
        //        .elementByCss('input#childPositionTextBox:not([readonly])').keys("ChildPosition1")
        .elementByCss('input[value=Submit]').click()
        .sleep(3000)

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
