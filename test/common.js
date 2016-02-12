var config = require('nconf');
config.file({file: './test/config.json'});

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');
var browser = wd.promiseChainRemote(config.get("remote")); 

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// optional extra logging
browser.on('status', function(info) {
    console.log(info);
});
browser.on('command', function(meth, path, data) {
    console.log(' > ' + meth, path, data || '');
});

exports.config = config;
exports.browser = browser;
