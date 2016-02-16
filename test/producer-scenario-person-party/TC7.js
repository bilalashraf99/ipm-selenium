require("date-utils");
var common = require("../common");
var browser = common.browser;

it("Enter data - Add producer information and Submit form", function () {

    var format = 'MMM DD, YYYY 00:00';

    var nextDayXPath = '//div[contains(concat(" ", normalize-space(@class), " "), " x-datepicker ") and not(contains(@style,"display: none"))]'
        + '//td[contains(concat(" ", normalize-space(@class), " "), " x-datepicker-today ")]/following::td[1]';

    var clickAll = function(elements) {
        var result = [];
        for (var i = 0; i < elements.length; i++) {
            result.push(elements[i].click());
        }
        return Promise.all(result);
    };

    return browser
        // Click Show Task button
        .frame()
        .elementByXPath('//span[normalize-space(text())="Show Task"]').click()

        // Click Submit
        .frame('TaskShowFrame')
        .elementByCss('input[value=Submit]').click()
        .waitForElementByCss('.x-message-box').text().should.eventually.include("Please complete all the sections")

        // Click OK to dismiss alert
        .elementByCss('.x-message-box span.x-btn-button').click()

        // Fill in Basic Information form data
        .elementById('basicInfoHeader').click()
        .elementById('textField2').type('Mr')
        .elementById('MiddleNameDs').type('Abc')
        .elementById('GenderDs').type('Male')
        .elementById('textField7').type('John Abc Blumberg')
        .elementById('errorsAndOmissionsHeader').click()

        // Fill in Errors and Omissions form data
        .elementById('CarrierDs').type('CarrierOne')
        .elementById('PolicyNumberDs').type('1111')
        .elementById('ClaimLimitDs').type('2222')
        .elementById('PolicyLimitDs').type('3333')
        .elementById('CertificateNumberDs').type('certificate123')
        .elementById('paymentAccountsHeader').click()

        // Fill in Payment Accounts form data
        .elementById('AccountHolderNameDs1').type('John Blumberg')
        .elementById('BankNameDs1').type('TestBankName')
        .elementById('BankRoutingNumberDs1').type('123456')
        .elementById('AccountNumberDs1').type('654321')
        .elementById('date_Time3_id-inputEl').type(Date.today().toFormat(format))
        .elementById('date_Time5_id-inputEl').type(Date.tomorrow().toFormat(format))
        .elementById('continuingEducationHeader').click()

        // Fill in Continuing Education form data
        .elementByCss('div#continuingEducationContentDiv input#date_Time0-inputEl').click()
        .sleep(100).elementByXPath(nextDayXPath).click()
        .elementByCss('div#continuingEducationContentDiv input#date_Time1-inputEl').click()
        .sleep(100).elementByXPath(nextDayXPath).click()
        .elementByCss('div#continuingEducationContentDiv input#date_Time2-inputEl').click()
        .sleep(100).elementByXPath(nextDayXPath).click()
        .elementById('legalQuestionsHeader').click()

        // Fill in Legal Questions form data
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=Yes]').then(clickAll)
        .elementById('appointmentRequestsHeader').click()

        // Fill in Appointment Requests form data
        .elementByXPath('//div[@id="licensesBODsDiv"]//td[contains(text(), "Michigan")]/following::input[1]').click()
        .elementByCss('select#unclicensedStateDD').type('Alabama')
        .elementByCss('input#addUnlicensedStateButton').click()
        .elementByCss('div#unlicensedStateContentDiv').text().should.become('Alabama')
        .elementByCss('select#unclicensedStateDD').getValue().should.become('Select One')

        // Add additional unlicenesed state
        .elementByCss('select#unclicensedStateDD').type('Alaska')
        .elementByCss('input#addUnlicensedStateButton').click()
        .elementByCss('div#unlicensedStateContentDiv').text()
        .should.eventually.include('Alabama').and.should.eventually.include('Alaska')
        .elementByCss('select#unclicensedStateDD').getValue().should.become('Select One')

        // Click 'X' sign beside 'Alabama'
        .elementByXPath('//span[normalize-space(text())="Alabama"]/following-sibling::span').click()
        .elementByCss('div#unlicensedStateContentDiv').text()
        .should.eventually.not.include('Alabama')

        // NOT IN STEPS: Click Payment Accounts nav link
        .elementByCss('#paymentAccountsNavLink').click()

        // Click on Submit button
        .elementByCss('input[value=Submit]').click().sleep(10000)
        .frame('TaskShowFrame')
        .waitForElementByCss('div#unlicensedStateNamesDiv').should.eventually.include('Alaska')

        // Click on Complete button
        .elementByCss('input[value=Complete]').click();

});
