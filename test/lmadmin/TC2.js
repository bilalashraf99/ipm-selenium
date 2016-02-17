var common = require("../common");
var browser = common.browser;

it("View default letter keys", function () {

    var xPath = '//table[@role="presentation"]//a[starts-with(normalize-space(text()), "Specify Letter Details")]';

    return browser
        // Click on My Tasks tab
        .waitForElementByLinkText('My Tasks').click()

        // Click on "Specify Letter Details" column
        .waitForElementByXPath(xPath).click()

        // Select OnBoarding from the dropdown and verify
        .frame('TaskShowFrame')
        .waitForElementByCss('select#appNamesCombo option[value=OnBoarding]').click()
        .sleep(1000)
        .waitForElementById('letterKeysForApplicationTable').text()
        .should.eventually.include("OB_LK_0001")
        .and.should.eventually.include("Data Entry Notification")
        .and.should.eventually.include("OB_LK_0008")

        // Click on Reset button
        .elementById('bizsite_reset_RESET_LABEL_id').click()
        .sleep(500)
        .elementByCss('select#appNamesCombo').getValue().should.become("-1")

        // Select AddAppointment from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=AddAppointment]').click()
        .sleep(1000)
        .waitForElementById('letterKeysForApplicationTable').text()
        .should.eventually.include("ADD_AP_COMP_LK")
        .and.should.eventually.include("Appointment Initiation Notification")
        .and.should.eventually.include("ADD_AP_REJ_LK")

        // Select DisputeResolution from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=DisputeResolution]').click()
        .sleep(1000)
        .waitForElementById('letterKeysForApplicationTable').text()
        .should.eventually.include("DR_ACK")
        .and.should.eventually.include("DR_LK_004")
        .and.should.eventually.include("DR_LK_006")

        // Select HierarchyTransfer from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=HierarchyTransfer]').click()
        .sleep(1000)
        .waitForElementById('letterKeysForApplicationTable').text()
        .should.eventually.include("HT_LK_01")

        // Select Termination from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=Termination]').click()
        .sleep(1000)
        .waitForElementById('letterKeysForApplicationTable').text()
        .should.eventually.include("TERM_COMP_LK")
        .and.should.eventually.include("TERM_INIT_LK")
        .and.should.eventually.include("TERM_REJ_LK")

        // Select ExamMonitor from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=ExamMonitor]').click()
        .sleep(1000)
        .waitForElementById('letterKeysForApplicationTable').text()
        .should.eventually.include("EM_LK_001")

        // Select ContactPointManager from the dropdown and verify
        .waitForElementByCss('select#appNamesCombo option[value=ContactPointManager]').click()
        .sleep(1000)
        .waitForElementById('letterKeysForApplicationTable').text()
        .should.eventually.include("CPM_LK")

        // Click on Cancel button and verify
        .elementById('btn-cancel_CANCEL_LABEL_id').click()
        .frame()
        .waitForElementById('filterEnclPanel');

});