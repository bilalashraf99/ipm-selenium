var common = require("../common");
var browser = common.browser;

it("Modify Continuing Education courses", function () {

    return browser
        // Load page
        .get(common.obAdminUrl)

        // Select "Configuration Data" radio button and click Next
        .elementByCss('input[value=ConfigurationData]').click()
        .elementByCss('a#SB_Name_Next_id').click()

        // Select OnBoarding / Continuing Education Courses For Person and verify
        .waitForElementByCss('#applicationListCombo option[value=OnBoarding]').click()
        .waitForElementByCss('#entityNameCombo option[value="Continuing Education Courses For Person"]').click()
        .waitForElementByCss('table[role=presentation]').text().should.eventually.include("AML Training")
        .and.should.eventually.include("Model Law Training").and.should.eventually.include("IA Index Training")

        // Delete IA Index Training
        .elementByXPath('//td/div[normalize-space(text()) = "IA Index Training"]').click()
        .elementByCss('input[value=Delete]').click()
        .acceptAlert()
        .waitForElementByLinkText('OK').click()

        // Reset form
        .elementByCss('a#bizsite_reset_RESET_LABEL_id').click()
        .elementByCss('#applicationListCombo').getValue().should.become("-1")

        // Select OnBoarding / Continuing Education Courses For Organization
        .elementByCss('#applicationListCombo option[value=OnBoarding]').click()
        .waitForElementByCss('#entityNameCombo option[value="Continuing Education Courses For Organization"]').click()

        // Add IA Index Training with display order 3
        .elementByCss('textarea#EValue').type("IA Index Training")
        .elementByCss('input#DOrder').type("3")
        .elementByCss('input[value=Add]').click()
        .acceptAlert()
        .waitForElementByLinkText('OK').click().sleep(1000)
        .elementByCss('table[role=presentation]').text().should.eventually.include("AML Training")
        .and.should.eventually.include("Model Law Training").and.should.eventually.include("IA Index Training");

});
