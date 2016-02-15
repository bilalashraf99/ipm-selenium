var common = require("../common");
var browser = common.browser;

it("Modify Payment Account types, Payment Balance Type", function () {

    return browser
        // Select OnBoarding / PaymentAccount.Type and verify
        .waitForElementByCss('#applicationListCombo option[value=OnBoarding]').click()
        .waitForElementByCss('#entityNameCombo option[value="PaymentAccount.Type"]').click()
        .waitForElementByCss('table[role=presentation] tr').click().text().should.eventually.include('{"Default Payment":"DefaultPayment","Escrow":"Escrow"}')

        // Modify the entity value and verify
        .elementByCss('textarea#EValue').clear().type('{"Default Payment":"DefaultPayment","Escrow":"Escrow","PAName":"PAValue"}')
        .elementByCss('input[value=Update]').click()
        .acceptAlert()
        .waitForElementByLinkText('OK').click().sleep(1000)
        .waitForElementByCss('table[role=presentation] tr').text().should.eventually.include('{"Default Payment":"DefaultPayment","Escrow":"Escrow","PAName":"PAValue"}')

        // Select PaymentBalance from Entity Name dropdown
        .elementByCss('#entityNameCombo option[value="PaymentBalance.Type"]').click()
        .sleep(1000)
        .waitForElementByCss('table[role=presentation] tr').click().text().should.eventually.include('{"W2":"W2","1099 Non Proprietary":"1099-NonProprietary","1099":"1099"}')

        // Modify the entity value and verify
        .elementByCss('textarea#EValue').clear().type('{"W2":"W2","1099 Non Proprietary":"1099-NonProprietary","1099":"1099","BalName1":"BalVal1"}')
        .elementByCss('input[value=Update]').click()
        .acceptAlert()
        .waitForElementByLinkText('OK').click().sleep(1000)
        .waitForElementByCss('table[role=presentation] tr').text().should.eventually.include('{"W2":"W2","1099 Non Proprietary":"1099-NonProprietary","1099":"1099","BalName1":"BalVal1"}');

});
