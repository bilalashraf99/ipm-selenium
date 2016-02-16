var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

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
        // Load page
        .get(url)

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click on Approval task among search results
        .waitForElementByCss('select#searchField option[value=TAX_ID]', 5000).click()
        .elementByCss('input#searchText').type('020258767')
        .elementByCss('input#search').click()
        .waitForElementByXPath("//*[@id='SearchResults']/descendant::td[@data-qtip='020258767']/parent::tr/child::td[@data-qtip='Willis Of New Hampshire Inc']/parent::tr/descendant::a[normalize-space(text())='Approval']").click()

        // Click on Approve button
        .frame('TaskShowFrame')
        .waitForElementByCss('input[value=Approve]').click()

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
        .elementById('childPositionTextBox').type("ChildPosition1")
        .elementByCss('select#positionTypeCombo option[value=Producer]').click()

        // Click on Submit button
        .elementByCss('input[value=Submit]').click()

        // Log out
        .frame()
        .waitForElementById('dashboardPanel-body')
        .elementByLinkText('Logout').click();

});
