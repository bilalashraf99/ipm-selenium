var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Approval - View producer information and Approval - Accept / Reject sections and perform Fix action", function() {

    var approvalXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='371494996']/parent::tr/child::td[@data-qtip='Willis of New Hampshire Inc']/parent::tr/descendant::a[normalize-space(text())='Approval']";

    var nested = function() {
        return browser
            .elementByCss('#SearchResults a[data-qtip="Next Page"]:not(.x-btn-disabled)').then(function(ref){
                return ref.click()
                    .waitForElementByXPath(approvalXPath)
                    .catch(nested);
            });
    };

    var verifyAllSelected = function (elements) {
        var result = [];
        for (var i = 0; i < elements.length; i++) {
            result.push(elements[i].isSelected().should.eventually.be.true);
        }
        return Promise.all(result);
    };

    return browser
        // Click Logout button
        .frame()
        .elementByLinkText('Logout').click()

        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')

        // Click on new Approval task among search results
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('371494996')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(approvalXPath)
        .catch(nested).click()

        // Verify and accept Basic Information section
        .frame('TaskShowFrame')
        .elementByCss('input[name=OrganizationNameDs]').getValue().should.become('National Benefits Group Llc Dba Greenway Financial')
        .elementByCss('textarea#StatusReason_EDUD_BasicInfoApproval').type('Accepted by AnalystUser')
        .elementByCss('div#basicInfoContentDiv').elementByLinkText('>', 'Accept').click()

        // Verify and accept Contact Information section
        .elementByCss('input[name=EmailDs1]:disabled').getValue().should.eventually.not.be.empty
        .elementByCss('textarea#StatusReason_EDUD_ContactInfoApproval').type('Accepted by AnalystUser')
        .elementByCss('div#contactInformationContentDiv').elementByLinkText('>', 'Accept').click()

        // Verify and reject Errors and Omissions section
        .elementByCss('input[name=CarrierDs]:disabled').getValue().should.become('CarrierOne')
        .elementByCss('input[name=PolicyNumberDs]:disabled').getValue().should.become('1111')
        .elementByCss('input[name=ClaimLimitDs]:disabled').getValue().should.become('2222')
        .elementByCss('input[name=PolicyLimitDs]:disabled').getValue().should.become('3333')
        .elementByCss('input[name=CertificateNumberDs]:disabled').getValue().should.become('certificate123')
        .elementByCss('textarea#StatusReason_EDUD_EnOApproval').type('Rejected by AnalystUser')
        .elementByCss('div#errorsAndOmissionsContentDiv').elementByLinkText('>', 'Reject').click()

        // Verify Payment Accounts section
        .elementByCss('#EDUD_AccountTypeDs1:disabled').getValue().should.become('DefaultPayment')
        .elementByCss('#EDUD_PaymentTypeDs1:disabled').getValue().should.become('W2')
        .elementByCss('input[name=AccountHolderNameDs1]:disabled').getValue().should.become('National Benefits')
        .elementByCss('input[name=BankNameDs1]:disabled').getValue().should.become('Bank1')
        .elementByCss('input[name=BankRoutingNumberDs1]:disabled').getValue().should.become('1111')
        .elementByCss('input[name=AccountNumberDs1]:disabled').getValue().should.become('2222')
        //.elementByCss('#EDUD_AccountTypeDs2:disabled').getValue().should.become('Escrow')
        //.elementByCss('#EDUD_PaymentTypeDs2:disabled').getValue().should.become('1099')
        //.elementByCss('input[name=AccountHolderNameDs2]:disabled').getValue().should.become('Willis of New Hampshire Inc')
        //.elementByCss('input[name=BankNameDs2]:disabled').getValue().should.become('Bank2')
        //.elementByCss('input[name=BankRoutingNumberDs2]:disabled').getValue().should.become('3333')
        //.elementByCss('input[name=AccountNumberDs2]:disabled').getValue().should.become('4444')
        .elementByCss('textarea#StatusReason_EDUD_PaymentInfoApproval').type('Rejected by AnalystUser')
        .elementByCss('div#paymentAccountsContentDiv').elementByLinkText('>', 'Reject').click()

        // Verify Continuing Education section
        .elementByCss('#continuingEducationContentDiv').text()
        .should.eventually.include('AML Training')
        .and.should.eventually.include('IA Index Training')
        .and.should.eventually.include('Model Law Training')
        .elementByCss('textarea#StatusReason_EDUD_ContEdApproval').type('Accepted by AnalystUser')
        .elementByCss('div#continuingEducationContentDiv').elementByLinkText('>', 'Accept').click()

        // Verify Legal Questions section
        .elementsByCss('#legalQuestionsContentDiv input[value=Yes]').then(verifyAllSelected)
        .elementByCss('textarea#StatusReason_EDUD_LeagalQuesApproval').type('Accepted by AnalystUser')
        .elementByCss('div#legalQuestionsContentDiv').elementByLinkText('>', 'Accept').click()

        // Verify Appointment Requests section
        .elementsByCss('#appointmentRequestsContentDiv input[type=checkbox]').then(verifyAllSelected)
        .elementByCss('#appointmentRequestsContentDiv').text().should.eventually.include("Alaska")
        .elementByCss('textarea#StatusReason_EDUD_AppApproval').type('Accepted by AnalystUser')
        .elementByCss('div#appointmentRequestsContentDiv').elementByLinkText('>', 'Accept').click()

        // Verify Upload Documents section
        .elementByXPath('//div[@id="uploadDocumentsContentDiv"]//td[normalize-space(text())="W-9"]/parent::tr').text().should.eventually.include("AppUnderReview.docx")
        .elementByXPath('//div[@id="uploadDocumentsContentDiv"]//td[normalize-space(text())="Proof of E & O"]/parent::tr').text().should.eventually.include("CloseCase.docx")
        .elementByXPath('//div[@id="uploadDocumentsContentDiv"]//td[normalize-space(text())="License"]/parent::tr').text().should.eventually.include("CloseCaseDeclination.docx")
        .elementByXPath('//div[@id="uploadDocumentsContentDiv"]//td[normalize-space(text())="Direct Deposit"]/parent::tr').text().should.eventually.include("DataEntry.docx")
        .elementByCss('textarea#StatusReason_EDUD1_UploadDocsApproval').type('Accepted by AnalystUser')
        .elementByCss('div#uploadDocumentsContentDiv').elementByLinkText('>', 'Accept').click()

        // Verify E-Sign Documents section
        .elementsByCss('#eSignDocumentsContentDiv input[type=checkbox]').then(verifyAllSelected)
        .elementByCss('input[name=eSignDs]:disabled').getValue().should.become("National Benefits")
        .elementByCss('textarea#StatusReason_EDUD1_ESignApproval').type('Rejected by AnalystUser')
        .elementByCss('div#paymentAccountsContentDiv').elementByLinkText('>', 'Reject').click()

        // Enter approver's comment and submit
        .elementByCss('textarea[name=txaCurrComm]').type('Some sections are rejected by Analyst')
        .elementByCss('input[type=submit][value=Fix]').click()
        .sleep(3000)

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
