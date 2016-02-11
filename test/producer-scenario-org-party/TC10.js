var wd = require('wd');
var http = require('http');
var fs = require('fs');

var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = config.get("ipm.url");

it("Send response to BIG and NIPR and complete flow", function() {

    var instanceId;

    wd.addAsyncMethod('postJson', function(fileName, path) {
        var cb = wd.findCallback(arguments);

        fs.readFile(fileName, 'utf-8', function(err, data) {
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

                var postRequest = http.request(options, function(res) {
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
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click on My Worksteps tab and get instance number
        .frame()
        .elementByLinkText('My Worksteps', 10000).click()
        .waitForElementById('assignedDate').click().sleep(500).click()
        .waitForElementByXPath('//div[contains(text(), "020258767")]').text().then(function(result) {
            var len = result.length;
            instanceId = result.substring(len-5, len-1);
        })

        // Send response for BIG
        .postJson('BIG_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse')

        // Send response for NIPR
        .postJson('NIPR_Request.txt', '/sbm/cxfws/BIGResponseReceiver/postBCResponse')

        // Click on Dashboard tab and verify search results
        .sleep(2000)
        .frame()
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
        .elementByCss('input#case_searchText').type('020258767')
        .elementByCss('input#case_search').click()
        .waitForElementByXPath("//*[@id='case_SearchResultsDefault']/descendant::td[@data-qtip='020258767']/parent::tr/child::td[@data-qtip='Willis Of New Hampshire Inc']/parent::tr/child::td[@data-qtip='COMPLETED']", 10000)

        // Log out
        .elementByLinkText('Logout').click();

});
