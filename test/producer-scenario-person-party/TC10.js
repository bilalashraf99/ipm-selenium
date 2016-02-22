var common = require("../common");
var config = common.config;
var browser = common.browser;

var url = common.bpmPortalUrl;

it("Approval - View producer information and Approval - Accept / Reject sections and perform Fix action", function() {

    var approvalXPath = "//*[@id='SearchResults']/descendant::td[@data-qtip='067600492']/parent::tr/child::td[@data-qtip='John Blumberg']/parent::tr/descendant::a[normalize-space(text())='Approval']";

    var nested = function(e) {
        return browser
            .elementByCss('#SearchResults a[data-qtip="Next Page"]:not(.x-btn-disabled)').then(function(ref){
                return ref.click()
                    .waitForElementByXPath(approvalXPath)
                    .catch(nested);
            });
    };

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click on new Approval task among search results
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('067600492')
        .elementByCss('input#search').click()
        .elementByXPath('//span[normalize-space(text())="CREATED DATE"]').click().click()
        .waitForElementByXPath(approvalXPath)
        .catch(nested).click()

        // Verify Basic Information section
        .frame('TaskShowFrame')
        .elementByCss('input[name=textField2]:disabled').getValue().should.become('Mr')
        .elementByCss('input[name=MiddleNameDs]').getValue().should.become('Abc')
        .elementByCss('input[name=GenderDs]').getValue().should.become('Male')
        .elementByCss('input[name=textField7]').getValue().should.become('John Abc Blumberg')

        // Verify Contact Information section
        .elementByCss('input[name=EmailDs1]:disabled').getValue().should.eventually.not.be.empty

        // Verify Errors and Omissions section
        .elementByCss('input[name=CarrierDs]:disabled').getValue().should.become('CarrierOne')
        .elementByCss('input[name=PolicyNumberDs]:disabled').getValue().should.become('1111')
        .elementByCss('input[name=ClaimLimitDs]:disabled').getValue().should.become('2222')
        .elementByCss('input[name=PolicyLimitDs]:disabled').getValue().should.become('3333')
        .elementByCss('input[name=CertificateNumberDs]:disabled').getValue().should.become('certificate123')

        // Verify Payment Accounts section
        .elementByCss('input[name=AccountHolderNameDs1]:disabled').getValue().should.become('John Blumberg')

        // Verify Continuing Education section
        .elementByCss('#continuingEducationContentDiv').text().should.eventually.include('IA Index Training')

        // Verify Legal Questions section
        .elementsByCss('#legalQuestionsContentDiv input[value=Yes]').then(function(elements) {
          var result = [];
          for (var i=0; i<elements.length; i++) {
            result.push(elements[i].isSelected());
          }
          return Promise.all(result);
        })

        // Verify Appointment Requests section
        .elementByXPath('//div[@id="appointmentRequestsContentDiv"]//td[contains(text(), "Michigan")]/following-sibling::td//input[@type="checkbox"]')
        .isSelected()
        .elementByCss('div[name=unlicensedStateContentDiv]').text().should.become('Alaska')

        // Verify Upload Documents section
        // No such section!

        // Verify E-Sign Documents section
        // No such section!

        // Reject and accept sections
        .elementByCss('textarea#StatusReason_EDUD_BasicInfoApproval').type('Rejected by AnalystUser')
        .elementByCss('div#basicInfoContentDiv').elementByLinkText('>', 'Reject').click()
        .elementByCss('textarea#StatusReason_EDUD_ContactInfoApproval').type('Rejected by AnalystUser')
        .elementByCss('div#contactInformationContentDiv').elementByLinkText('>', 'Reject').click()
        .elementByCss('textarea#StatusReason_EDUD_EnOApproval').type('Accepted by AnalystUser')
        .elementByCss('div#errorsAndOmissionsContentDiv').elementByLinkText('>', 'Accept').click()
        .elementByCss('textarea#StatusReason_EDUD_PaymentInfoApproval').type('Accepted by AnalystUser')
        .elementByCss('div#paymentAccountsContentDiv').elementByLinkText('>', 'Accept').click()
        .elementByCss('textarea#StatusReason_EDUD_ContEdApproval').type('Accepted by AnalystUser')
        .elementByCss('div#continuingEducationContentDiv').elementByLinkText('>', 'Accept').click()
        .elementByCss('textarea#StatusReason_EDUD_LeagalQuesApproval').type('Accepted by AnalystUser')
        .elementByCss('div#legalQuestionsContentDiv').elementByLinkText('>', 'Accept').click()
        .elementByCss('textarea#StatusReason_EDUD_AppApproval').type('Accepted by AnalystUser')
        .elementByCss('div#appointmentRequestsContentDiv').elementByLinkText('>', 'Accept').click()
        // TODO: Upload Documents section?
        // TODO: E-Sign Documents section?
        .elementByCss('textarea[name=txaCurrComm]').type('Some sections are rejected by Analyst')
        .elementByCss('input[type=submit][value=Fix]').click()

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
