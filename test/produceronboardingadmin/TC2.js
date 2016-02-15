var common = require("../common");
var browser = common.browser;

it("Modify Legal Questions", function () {

    return browser
        // Reset form
        .elementByCss('a#bizsite_reset_RESET_LABEL_id').click()

        // Select OnBoarding / Legal Questions and verify
        .waitForElementByCss('#applicationListCombo option[value=OnBoarding]').click()
        .waitForElementByCss('#entityNameCombo option[value="Legal Questions"]').click()
        .waitForElementsByCss('table[role=presentation] tr').should.eventually.have.length(10)

        // Delete first row
        .elementByCss('table[role=presentation] tr').click()
        .elementByCss('input[value=Delete]').click()
        .acceptAlert()
        .waitForElementByLinkText('OK').click().sleep(1000)
        .waitForElementsByCss('table[role=presentation] tr').should.eventually.have.length(9)

        // Add new Legal Question
        .elementByCss('textarea#EValue').type("Legal Question 1")
        .elementByCss('input#DOrder').type("1")
        .elementByCss('input[value=Add]').click()
        .acceptAlert()
        .waitForElementByLinkText('OK').click().sleep(1000)
        .waitForElementsByCss('table[role=presentation] tr').should.eventually.have.length(10)

        // Reset form
        .elementByCss('a#bizsite_reset_RESET_LABEL_id').click();

});
