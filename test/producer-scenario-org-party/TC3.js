require("date-utils");
var common = require("../common");
var browser = common.browser;

it("Enter data - Add producer information and Submit form", function() {

    var format = 'MMM DD, YYYY 00:00';

    return browser
        // Click Show Task button
        .frame()
        .elementByXPath('//span[normalize-space(text())="Show Task"]').click()

        // Click Submit and dismiss alert
        .frame('TaskShowFrame')
        .elementByCss('input[value=Submit]').click()
        .waitForElementByCss('.x-message-box')//.text().should.eventually.include("Please complete all the sections")
        .elementByCss('.x-message-box span.x-btn-button').click()

        // Verify Basic Information form data
        .elementById('basicInfoHeader').click()
        .elementById('PartyNameDs').getValue().should.become("National Benefits Group Llc Dba Greenway Financial")

        // Fill in Errors and Omissions form data
        .elementById('errorsAndOmissionsHeader').click()
        .elementById('CarrierDs').type('CarrierOne')
        .elementById('PolicyNumberDs').type('1111')
        .elementById('ClaimLimitDs').type('2222')
        .elementById('PolicyLimitDs').type('3333')
        .elementById('CertificateNumberDs').type('certificate123')

        // Fill in Payment Accounts form data
        .elementById('paymentAccountsHeader').click()
        .elementById('AccountHolderNameDs1').type('National Benefits')
        .elementById('BankNameDs1').type('Bank1')
        .elementById('BankRoutingNumberDs1').type('1111')
        .elementById('AccountNumberDs1').type('2222')
        .elementById('date_Time3_id-inputEl').type(Date.today().toFormat(format))

        // TODO: Get bug fixed preventing form submission with second payment account!
        //// Fill in second account data
        //.elementByLinkText('Add Another Account').click()
        //.elementByCss('#AccountTypeDs2 option[value=Escrow]').click()
        //.elementByCss('#PaymentTypeDs2 option[value="1099"]').click()
        //.elementById('AccountHolderNameDs2').type('Willis')
        //.elementById('BankNameDs2').type('Bank2')
        //.elementById('BankRoutingNumberDs2').type('3333')
        //.elementById('AccountNumberDs2').type('4444')
        //.elementByCss('#paymentAccountsContentDiv input[id^=datefield-]').type(Date.today().toFormat(format))

        // Fill in Continuing Education form data
        .elementById('continuingEducationHeader').click()
        .elementById('continuingEducationContentDiv').text().should.eventually.include("AML Training for Organization")
        .and.should.eventually.include("Model Law Training for Organization")

        // Fill in Legal Questions form data
        .elementById('legalQuestionsHeader').click()
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=Yes]').then(common.clickAll)

        // Fill in Appointment Requests form data
        .elementById('appointmentRequestsHeader').click()
        .elementByCss('#appointmentRequestsContentDiv input[type=checkbox]:not(:checked)').then(common.clickAll)
        .elementByCss('select#unclicensedStateDD option[value=Alabama]').click()
        .elementByCss('input#addUnlicensedStateButton').click()
        .elementByCss('div#unlicensedStateContentDiv').text().should.become('Alabama')
        .elementByCss('select#unclicensedStateDD').getValue().should.become('Select One')

        // TODO: Section below removes the unlicensed state as it prevents reaching the Upload Docs page. Clarification needed.
        // Click 'X' sign beside 'Alabama'
        .elementByXPath('//span[normalize-space(text())="Alabama"]/following-sibling::span').click()
        .elementByCss('div#unlicensedStateContentDiv').text()
        .should.eventually.not.include('Alabama')

        // Click on Submit button
        .elementByLinkText('Collapse All').click()
        .elementByCss('input[value=Submit]').click()
        .sleep(10000)
        //.frame('TaskShowFrame')
        //.waitForElementByCss('div#unlicensedStateNamesDiv').should.eventually.include('Alabama')
        //
        //// Click on Complete button
        //.elementByCss('input[value=Complete]').click()

        .frame('TaskShowFrame')
        .waitForElementByCss('div#midPanel').text().should.eventually.include('Upload Documents and ESignature');

});
