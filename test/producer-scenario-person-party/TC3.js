var common = require("../common");
var browser = common.browser;

var url = common.bpmPortalUrl;
  
it("Reset data on Initiate New Producer Onboarding", function () {

    return browser
        // Load login page
        .get(url)

        // Log in as user 'AnalystUser1'
        .login('analyst')
    
        // Click on Dashboard tab
        .frame()
        .elementByLinkText('Dashboard').click()

        // Click OnBoarding link in My Widgets section
        .waitForElementByLinkText('OnBoarding', 10000).click()

        // Fill form with Organization data
        .frame('AppShowFrame')
        .sleep(1000) // Fix for issue where fields get cleared while driver is typing
        .elementByCss('#combobox1 option[value=Organization]').click()
        .elementById('TaxIdDs').type('123456789')
        .elementById('EmailDs').type('abc@gmail.com')
        .elementById('OrganizationNameDsStart').type('TestOrg')
        .elementByCss('#combobox6 option[value="IFS Bank"]').click()
        .elementById('checkbox1').click()
        .elementById('checkbox2').click()

        // Click on Reset button
        .elementByLinkText('Reset').click()
        .elementById('combobox1').getValue().should.eventually.equal('Person')
        .elementById('TaxIdDs').getValue().should.eventually.be.empty
        .elementById('EmailDs').getValue().should.eventually.be.empty
        .elementById('FirstNameDsStart').getValue().should.eventually.be.empty
        .elementById('LastNameDsStart').getValue().should.eventually.be.empty
        .elementById('combobox6').getValue().should.become('Select One')
        .elementById('checkbox1').isSelected().should.become(false)
        .elementById('checkbox2').isSelected().should.become(true)

        // Click on Dashboard tab
        .frame()
        .elementByLinkText('Dashboard').click()

        // Click OnBoarding link in My Widgets section
        .waitForElementByLinkText('OnBoarding', 10000).click()

        // Fill form with Person data
        .frame('AppShowFrame')
        .elementById('TaxIdDs').type('123456789')
        .elementById('EmailDs').type('abc@gmail.com')
        .elementById('FirstNameDsStart').type('Thomas')
        .elementById('LastNameDsStart').type('Feola')
        .elementByCss('#combobox6 option[value="IFS Bank"]').click()
        .elementById('checkbox1').click()
        .elementById('checkbox2').click()

        // Click on Reset button
        .elementByLinkText('Reset').click()
        .elementById('TaxIdDs').getValue().should.eventually.be.empty
        .elementById('EmailDs').getValue().should.eventually.be.empty
        .elementById('OrganizationNameDsStart').getValue().should.eventually.be.empty
        .elementById('combobox6').getValue().should.become('Select One')
        .elementById('checkbox1').isSelected().should.become(false)
        .elementById('checkbox2').isSelected().should.become(true)

        // Log out
        .frame()
        .elementByLinkText('Logout').click();

});
