var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Select Upline, Send response to BIG and NIPR - Person party", function() {

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

    var instanceId;

    return browser
        // Click 'Select Parent Position'
        .windowHandle().then(function(handle) {
            mainWindow = handle;
        })
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
        .elementById('childPositionTextBox').type("ChildPos1")
        .elementByCss('select#positionTypeCombo option[value=Producer]').click()

        // Click on Submit button
        .elementByCss('input[value=Submit]').click()
        .sleep(4000)

        // Click on My Worksteps tab and get instance number
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementById('assignedDate').click().sleep(500).click()
        .waitForElementByXPath('//div[contains(text(), "067600492")]').text().then(function(result) {
            var len = result.length;
            instanceId = result.substring(len-5, len-1);
        }).sleep(1000)

        // Send response for BIG
        .postJson('files/BIG_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse', instanceId)

        // Send response for NIPR
        .postJson('files/NIPR_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse', instanceId)

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
