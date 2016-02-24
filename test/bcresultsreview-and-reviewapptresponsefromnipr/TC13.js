var common = require("../common");
var browser = common.browser;

it("Create instance and EnterDataAndReviewDocs", function() {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .elementByCss('form[name=loginForm] input[name=BizPassUserID]').type(config.get("analyst.username"))
        .elementByCss('form[name=loginForm] input[name=BizPassUserPassword]').type(config.get("analyst.password"))
        .elementByCss('form[name=loginForm] input[type=submit]').click()

        // Click OnBoarding link in My Widgets section
        .waitForElementByLinkText('OnBoarding', 10000).click()

        // Fill form with user data and submit
        .frame('AppShowFrame')
        .sleep(1000) // Fix for issue where fields get cleared while driver is typing
        .elementById('TaxIdDs').type('326588332')
        .elementById('EmailDs').type('solnsengg@gmail.com')
        .elementById('FirstNameDsStart').type('Fred')
        .elementById('LastNameDsStart').type('Sellers')
        .elementByCss('select#combobox6 option[value="LLIC"]').click()
        .elementById('checkbox1').click()
        .elementById('checkbox2').click()
        .elementById('createButton').click()
        .waitForElementById('dashboardPanel', 5000)

        // WAIT
        .sleep(8000)

        // Click on Dashboard tab
        .frame()
        .elementByLinkText('Dashboard', 10000).click()

        // Verify new case among search results
        .waitForElementByCss('select#case_searchField option[value=TAX_ID]').click()
        .waitForElementByCss('input#case_searchText').type('326588332')
        .waitForElementByCss('input#case_search').click()
        .waitForElementByXPath("//*[@id='case_SearchResults']/descendant::td[@data-qtip='326588332']/parent::tr/child::td[@data-qtip='Fred Sellers']/parent::tr/child::td[@data-qtip='ACTIVATED']", 10000)

        // Click on EnterDataAndReviewDocs
        .waitForElementByCss('select#searchField option[value=TAX_ID]').click()
        .elementByCss('input#searchText').type('326588332')
        .elementByCss('input#search').click()
        .waitForElementByLinkText('EnterDataAndReviewDocs', 10000).click()

        // Expand all sections
        .frame('TaskShowFrame')
        .waitForElementByLinkText('Expand All').click()

        // Fill in Contact Information form data
        .waitForElementById('contactInformationHeader').click()
        .elementById('Street1Ds1').type('s1')
        .elementById('CityDs1').type('cityone')
        .elementByCss('#StateDs1 option[value=CA]').click()
        .elementById('ZipDs1').type('1111')
        .elementById('PhoneDs1').type('2222')
        .elementById('EmailDs1').type('solnsengg@gmail.com')

        // Fill in Errors and Omissions form data
        .elementById('CarrierDs').type('Carrier1')
        .elementById('PolicyNumberDs').type('1111')
        .elementById('ClaimLimitDs').type('2222')
        .elementById('PolicyLimitDs').type('3333')
        .elementById('CertificateNumberDs').type('certificate123')

        // Fill in Payment Accounts form data
        .elementById('AccountHolderNameDs1').type('Fred Sellers')
        .elementById('BankNameDs1').type('Bank1')
        .elementById('BankRoutingNumberDs1').type('1111')
        .elementById('AccountNumberDs1').type('2222')
        .elementById('date_Time3_id-inputEl').type("Jan 01, 2015 00:00")
        .elementById('date_Time5_id-inputEl').type("Jan 01, 2300 00:00")

        // Fill in Legal Questions form data
        .elementsByCss('div#legalQuestionsContentDiv input[type=radio][value=Yes]').then(common.clickAll)

        // Fill in Appointment Requests form data
        .elementByXPath('//div[@id="licensesBODsDiv"]//td[contains(text(), "Michigan")]/following::input[1]').click()

        // Fill in Upload Documents form data
        .elementsByCss('#RequiredDocNamesTableDiv tr td:nth-child(2) input[type=radio]').then(common.clickAll)
        .elementsByCss('#RequiredDocNamesTableDiv tr td:nth-child(5) input[type=radio]').then(common.clickAll)

        // Click Collapse All and reopen Upload Documents section
        .elementByLinkText('Collapse All').click()
        .elementById('uploadDocumentsHeader').click()
        .elementById('headerLeftAndNavigationSummary').text().should.become("8 of 8 steps complete")

        // Click on Submit button
        .elementByCss('input[value=Submit]').click()
        .waitForElementByCss('div#midPanelHeader').text().should.become('Select Up-line');

});
