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

exports.config = config;
exports.browser = browser;
exports.bpmPortalUrl = bpmPortalUrl;
exports.obAdminUrl = obAdminUrl;
