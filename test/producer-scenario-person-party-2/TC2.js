var common = require("../common");
var browser = common.browser;


it("Enter data - Add / View Notes", function () {

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
        // Click on Notes button and open Notes dialog
        .frame('TaskShowFrame')
        .elementByLinkText('Notes').click()
        .then(selectChildWindow)

        // Enter first note
        .elementByCss('textarea#notes').type("first note by Fred Sellers")
        .elementByCss('input#add').click()
        .elementByCss('textarea#latestNote').text()
        .should.eventually.include("Activity: EnterDataAndUploadDocs")
        .and.should.eventually.include("Provided By: 326588332")
        .and.should.eventually.include("Note : first note by Fred Sellers")

        // Enter second note
        .elementByCss('textarea#notes').type("2nd note by Fred Sellers")
        .elementByCss('input#add').click()
        .elementByCss('textarea#latestNote').text()
        .should.eventually.include("Activity: EnterDataAndUploadDocs")
        .and.should.eventually.include("Provided By: 326588332")
        .and.should.eventually.include("Note : 2nd note by Fred Sellers")

        // Close and reopen Notes dialog
        .elementByCss('input#close').click()
        .then(selectMainWindow)
        .frame('TaskShowFrame')
        .elementByLinkText('Notes').click()
        .then(selectChildWindow)
        .elementByCss('textarea#latestNote').text()
        .should.eventually.include("Activity: EnterDataAndUploadDocs")
        .and.should.eventually.include("Provided By: 326588332")
        .and.should.eventually.include("Note : 2nd note by Fred Sellers")

        // Click Show All Notes and verify
        .elementByLinkText('Show All Notes').click()
        .waitForElementByXPath('//td[normalize-space(text())="All Notes:"]/following-sibling::td').text()
        .should.eventually.contain("first note by Fred Sellers")
        .and.should.eventually.contain("2nd note by Fred Sellers")

        // Click Hide All Notes and verify
        .elementByLinkText('Hide All Notes').click().sleep(100)
        .elementByXPath('//td[normalize-space(text())="All Notes:"]/following-sibling::td').isDisplayed()
        .should.eventually.be.false

        // Close dialog and click Submit
        .elementByCss('input#close').click()
        .then(selectMainWindow)
        .frame('TaskShowFrame')
        .elementByCss('input[value=Submit]').click();

});
