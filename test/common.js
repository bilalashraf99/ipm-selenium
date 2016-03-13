var config = require('nconf');
config.file({file: './test/config.json'});

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');
var browser = wd.promiseChainRemote(config.get("remote")); 

// Enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// Optional extra logging
browser.on('status', function(info) {
    console.log(info);
});
browser.on('command', function(meth, path, data) {
    console.log(' > ' + meth, path, data || '');
});

// Path to IPM BPM Portal
var bpmPortalUrl = "http://" + config.get("server.hostname") + ":" + config.get("ipm.port") + config.get("ipm.login.path");
// Path to IPM Onboarding Admin interface
var obAdminUrl = "http://" + config.get("server.hostname") + ":" + config.get("ipm.port") + config.get("ipm.ob.admin.path");

var retry = function(maxRetries, fn) {
    return fn().catch(function(err) {
        if (maxRetries <= 0) {
            throw err;
        }
        console.log("Retrying... " + maxRetries + " retries left");
        return retry(maxRetries - 1, fn);
    });
};

var clickAll = function(elements) {
    var result = [];
    for (var i = 0; i < elements.length; i++) {
        result.push(elements[i].click());
    }
    return Promise.all(result);
};

wd.addAsyncMethod('postJson', function (fileName, path, instanceId) {
    var cb = wd.findCallback(arguments);

    fs.readFile(fileName, 'utf-8', function (err, data) {
        if (err) {
            console.log("Error reading file!");
        }
        if (data) {
            var options = {
                hostname: config.get("server.hostname"),
                port: config.get("ipm.port"),
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

wd.addPromiseChainMethod('initiatePersonOnboarding', function (taxId, email, firstName, lastName, companyName, eoProvided, producerDataEntry) {
    var promise = browser
        // Click on Dashboard tab
        .frame()
        .elementByLinkText('Dashboard', 10000).click()

        // Click OnBoarding link in My Widgets section
        .waitForElementByLinkText('OnBoarding', 10000).click()

        // Fill form with user data and submit
        .frame('AppShowFrame')
        .sleep(1000) // Fix for issue where fields get cleared while driver is typing
        .elementById('TaxIdDs').type(taxId)
        .elementById('EmailDs').type(email)
        .elementById('FirstNameDsStart').type(firstName)
        .elementById('LastNameDsStart').type(lastName)
        .elementByCss('select#combobox6 option[value="' + companyName + '"]').click();

    if (eoProvided) {
        promise = promise.elementByCss('input#checkbox1').click();
    }
    if (!producerDataEntry) {
        promise = promise.elementByCss('input#checkbox2').click();
    }

    return promise
        .elementById('createButton').click()
        .frame()
        .waitForElementById('dashboardPanel', 100000);
});

wd.addPromiseChainMethod('initiateOrganizationOnboarding', function (taxId, email, name, companyName, eoProvided, producerDataEntry) {
    var promise = browser
        // Click on Dashboard tab
        .frame()
        .elementByLinkText('Dashboard', 10000).click()

        // Click OnBoarding link in My Widgets section
        .waitForElementByLinkText('OnBoarding', 10000).click()

        // Fill form with user data and submit
        .frame('AppShowFrame')
        .sleep(1000) // Fix for issue where fields get cleared while driver is typing
        .elementByCss('#combobox1 option[value=Organization]').click()
        .elementById('TaxIdDs').type(taxId)
        .elementById('EmailDs').type(email)
        .elementById('OrganizationNameDsStart').type(name)
        .elementByCss('select#combobox6 option[value="' + companyName + '"]').click();

    if (eoProvided) {
        promise = promise.elementByCss('input#checkbox1').click();
    }
    if (!producerDataEntry) {
        promise = promise.elementByCss('input#checkbox2').click();
    }

    return promise
        .elementById('createButton').click()
        .frame()
        .waitForElementById('dashboardPanel', 100000);
});

wd.addPromiseChainMethod('verifyNewCase', function(taxId, name) {
    var xPath = "//*[@id='case_SearchResults']/descendant::td[@data-qtip='" + taxId + "']/parent::tr/child::td[@data-qtip='" + name + "']/parent::tr/child::td[@data-qtip='ACTIVATED']";
    return browser
        // Click on Dashboard tab
        .frame()
        .elementByLinkText('Dashboard', 10000).click()
        .waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
        .waitForElementByCss('input#case_searchText').type(taxId)
        .waitForElementByCss('input#case_search').click()
        .waitForElementByXPath(xPath)
        .catch(function() {
            return retry(10, function() {
                return browser
                    .sleep(8000)
                    .elementByCss('#case_SearchResults a[data-qtip=Refresh]').click()
                    .waitForElementByXPath(xPath);
            });
        });
});

wd.addPromiseChainMethod('login', function(user) {
    return browser
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').clear().type(config.get(user + ".username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get(user + ".password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()
});

exports.config = config;
exports.browser = browser;
exports.bpmPortalUrl = bpmPortalUrl;
exports.obAdminUrl = obAdminUrl;
exports.clickAll = clickAll;
exports.retry = retry;