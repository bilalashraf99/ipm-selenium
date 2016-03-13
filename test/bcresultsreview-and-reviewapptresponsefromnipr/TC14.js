var common = require("../common");
var browser = common.browser;

it("Select Upline and Send response to BIG", function() {

    var instanceId;

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

        // Click on My Worksteps tab and get instance number
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementById('assignedDate').click().sleep(500).click()
        .waitForElementByXPath('//div[contains(text(), "067600492 ")]').text().then(function(result) {
            var len = result.length;
            instanceId = result.substring(len-5, len-1);
        }).sleep(1000)

        // Send response for BIG
        .then(function() {
            return browser.postJson('files/BIG_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse', instanceId);
        })

        // Click on Dashboard tab and verify search results
        .sleep(2000)
        .frame()
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('326588332')
        .elementByCss('input#search').click()
        .waitForElementByXPath("//*[@id='SearchResults']/descendant::td[@data-qtip='Fred Sellers']/parent::tr//a[normalize-space(text())='BCResultsReview']", 10000);

});
