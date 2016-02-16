var common = require("../common");
var browser = common.browser;

it("Modify Contact type and Contact usage", function () {

    return browser
        // Reset form
        .elementByCss('a#bizsite_reset_RESET_LABEL_id').click()

        // Select OnBoarding / CONTACT_USAGE and verify
        .waitForElementByCss('#applicationListCombo option[value=OnBoarding]').click()
        .waitForElementByCss('#entityNameCombo option[value="CONTACT_USAGE"]').click()
        .sleep(1000)
        .waitForElementByCss('table[role=presentation] tr').click().text()
        .should.eventually.include('{"Licensing Information":"LICENSINGINFO","Statements":"STATEMENTS","Mailing":"MAILING"' +
            ',"Settlement":"SETTLEMENT","Retired Primary":"RETIREDPRIMARY","Marketing Information":"MARKETINGINFO","Primary":"PRIMARY"}')

        // Modify the entity value and verify
        .elementByCss('textarea#EValue').clear()
        .type('{"Licensing Information":"LICENSINGINFO","Statements":"STATEMENTS","Mailing":"MAILING"' +
            ',"Settlement":"SETTLEMENT","Retired Primary":"RETIREDPRIMARY","Marketing Information":"MARKETINGINFO","Primary":"PRIMARY","UsageName1":"UsageVal1"}')
        .elementByCss('input[value=Update]').click()
        .acceptAlert()
        .waitForElementByLinkText('OK').click()
        .sleep(1000)
        .waitForElementByCss('table[role=presentation] tr').text()
        .should.eventually.include('{"Licensing Information":"LICENSINGINFO","Statements":"STATEMENTS","Mailing":"MAILING"' +
            ',"Settlement":"SETTLEMENT","Retired Primary":"RETIREDPRIMARY","Marketing Information":"MARKETINGINFO","Primary":"PRIMARY","UsageName1":"UsageVal1"}')

        // Select CONTACT_TYPE and verify
        .waitForElementByCss('#entityNameCombo option[value="CONTACT_TYPE"]').click()
        .sleep(1000)
        .waitForElementByCss('table[role=presentation] tr').click().text()
        .should.eventually.include('{"Residence Address":"HOME","Summer Residence Address":"SUMMERHOME","Location Physical Address":"LOCPHYSICAL"' +
            ',"Work Address":"WORK","Location Mailing Address":"LOCMAILING"}')

        // Modify the entity value and verify
        .elementByCss('textarea#EValue').clear()
        .type('{"Residence Address":"HOME","Summer Residence Address":"SUMMERHOME","Location Physical Address":"LOCPHYSICAL"' +
            ',"Work Address":"WORK","Location Mailing Address":"LOCMAILING","CTName1":"CTVal1"}')
        .elementByCss('input[value=Update]').click()
        .acceptAlert()
        .waitForElementByLinkText('OK').click()
        .sleep(1000)
        .waitForElementByCss('table[role=presentation] tr').text()
        .should.eventually.include('{"Residence Address":"HOME","Summer Residence Address":"SUMMERHOME","Location Physical Address":"LOCPHYSICAL"' +
            ',"Work Address":"WORK","Location Mailing Address":"LOCMAILING","CTName1":"CTVal1"}')

        // Reset form
        .elementByCss('a#bizsite_reset_RESET_LABEL_id').click();

});
