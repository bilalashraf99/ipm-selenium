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

exports.config = config;
exports.browser = browser;
