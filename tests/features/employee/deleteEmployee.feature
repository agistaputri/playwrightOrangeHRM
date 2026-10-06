Feature: Delete Employee

  Background:
    Given the user is logged in as Admin

  @deleteEmployee @deleteEmployee01
  Scenario: Successfully delete an employee from employee list
    And the user navigates to the "Add Employee" page
    When the user enters First Name "Amanda" and Last Name "Narita"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    And the user navigates to the "Employee List" page
    When the user searches for "Amanda Narita" in employee list
    When the user clicks the delete icon for employee "Amanda Narita"
    And the user confirms deleting the employee
    Then a successfully deleted message should be displayed
    When the user searches for "Amanda Narita" in employee list
    Then a "No Records Found" message should be displayed 

  @deleteEmployee @deleteEmployee02
  Scenario: Successfully cancel delete an employee from employee list
    And the user navigates to the "Add Employee" page
    When the user enters First Name "Jeremy" and Last Name "Tety"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    And the user navigates to the "Employee List" page
    When the user searches for "Jeremy Tety" in employee list
    When the user clicks the delete icon for employee "Jeremy Tety"
    And the user cancels deleting the employee
    When the user searches for "Jeremy Tety" in employee list
    Then the employee "Jeremy" should be displayed in the employee list