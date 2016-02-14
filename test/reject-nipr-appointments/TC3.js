var wd = require('wd');
var http = require('http');
var fs = require('fs');

var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

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

    wd.addAsyncMethod('postJson', function (fileName, path) {
        var cb = wd.findCallback(arguments);

        fs.readFile(fileName, 'utf-8', function (err, data) {
            if (err) {
                console.log("Error reading file!");
            }
            if (data) {
                var options = {
                    hostname: config.get("server.hostname"),
                    port: config.get("server.port"),
                    path: path,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(data.length)
                    }
                };

                var postRequest = http.request(options, function (res) {
                    res.on('data', function (chunk) {
                        console.log('Response: ' + chunk);
                        cb();
                    });
                });

                console.log(instanceId);
                data.replace('<InstanceID>', instanceId);
                postRequest.write(data);
                postRequest.end();
            }
        });
    });

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
        })

        // Send response for BIG
        .postJson('BIG_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse')

        // Send response for NIPR
        .postJson('NIPR_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse')

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
