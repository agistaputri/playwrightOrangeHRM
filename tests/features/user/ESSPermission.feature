Feature: Role-Based Access Control - ESS Permissions

  Background:
    Given the user is logged in as ESS

  @ESS @ESS1
  Scenario: ESS user should not see Admin menu in navigation sidebar
    Then the "Admin" menu should not be visible in the sidebar navigation

  @ESS @ESS2  
  Scenario: ESS user cannot access Admin module directly via URL
    When the user attempts to access the Admin URL directly
    Then the user should be redirected away from Admin page

  @ESS @ESS3  
  Scenario: ESS user cannot manage or delete employees in PIM module
    When the ESS user navigates to the "PIM" page
    Then the "Add Employee" button should not be displayed
    And the delete employee icon should not be displayed in the list