var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Reassign Case", function () {

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

        // Log in as user 'ManagerUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("manager.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("manager.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click Search icon in My Widgets
        .waitForElementByCss('input#case_search').click()

        // Open Search popup under Reassign Case
        .waitForElementByXPath('//*[@id="case_SearchResults"]//td/div[normalize-space(text())="ACTIVATED"]/parent::td/preceding-sibling::td//input').click()
        .elementByCss('#caseSearchDiv input#case_reassign').click()
        .waitForElementByCss('iframe#actionHandler')
        .frame('actionHandler')
        .waitForElementByCss('a img[title=Search]').click()

        // Reassign case
        .then(selectChildWindow)
        .waitForElementByLinkText('A').click()
        .waitForElementByXPath('//td[normalize-space(text()) = "AnalystUser2"]/parent::tr//input').click()
        .elementByCss('input[name=Add_Bt]').click()
        .then(selectMainWindow)
        .frame('actionHandler')
        .elementByCss('input[value=Reassign]').click()
        .waitForElementByCss('div.x-window.x-message-box').text().should.eventually.include("Case Reassigned Succsefully to AnalystUser2")
        .elementByCss('div.x-window.x-message-box span.x-btn-button').click()

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
