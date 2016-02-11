var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Select Upline - Person", function() {

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
    // Load login page
        .get(url).windowHandle().then(function(handle) {
            mainWindow = handle;
        })

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Open "Select Upline" task for Tax ID 020258767
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type("067600492")
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath('//*[@id="SearchResults"]/descendant::td[@data-qtip="067600492"]/parent::tr/descendant::a[normalize-space(text())="Select Upline"]').click()

        // Click 'Select Parent Position'
        .frame('TaskShowFrame')
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
        .waitForElementByCss('a#SelectChildPosition').click()
        .then(selectChildWindow)
        .elementById('searchByOrganizationRadio').click()
        .elementById('organizationNameTextBox').type("o")
        .elementByCss('input[value=Search]').click()
        .waitForElementById('selectUplineSearchTable', 8000)
        .elementByXPath('//td[normalize-space(text())="ORG1"]/preceding-sibling::td/input').click()
        .elementByCss('input[value=Submit]').click()
        .then(selectMainWindow)
        .frame('TaskShowFrame')
        .waitForElementById('childPositionTextBox').getValue().should.become("ChildPosition1")

        // Click on Submit button
        .elementByCss('input[value=Submit]').click()

        // Log out
        .frame()
        .waitForElementById('dashboardPanel-body')
        .elementByLinkText('Logout').click();

 });
