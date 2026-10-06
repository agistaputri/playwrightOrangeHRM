Feature: Add Employee

Background:
    Given the user is logged in as Admin
    And the user navigates to the "Add Employee" page
 
  @addEmployee @addEmployee01
  Scenario: Successfully create a new employee with mandatory fields only
    When the user enters First Name "John" and Last Name "Doe"
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed

  @addEmployee @addEmployee02
  Scenario: Successfully create a new employee with Middle Name and custom Employee ID
    When the user enters First Name "Jane", Middle Name "Alexander", and Last Name "Smith"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed

  @addEmployee @addEmployee03
  Scenario: Successfully create a new employee with Login Credentials enabled
    When the user enters First Name "Robert" and Last Name "Johnson"
    And the user toggles on "Create Login Details"
    And the user sets Username "robert.johnson", Password "SecurePass123!", and Confirm Password "SecurePass123!"
    And the user sets Status to "Enabled"
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed

  @addEmployee @addEmployee04
  Scenario: Fail to create an employee when mandatory fields are left blank
    When the user leaves First Name and Last Name empty
    And the user clicks the "Save" button
    Then a required error message should be displayed under First Name
    And a required error message should be displayed under Last Name
    And the employee record should not be created

  @addEmployee @addEmployee05
  Scenario: Fail to create an employee with an existing Employee ID
    When the user enters First Name "Alice" and Last Name "Brown"
    And the user enters an already existing Employee ID "0024"
    And the user clicks the "Save" button
    Then an already exist employee ID error message should be displayed under the Employee ID field

  @addEmployee @addEmployee06
  Scenario: Fail to create login details when password and confirm password do not match
    When the user enters First Name "David" and Last Name "Miller"
    And the user toggles on "Create Login Details"
    And the user sets Username "david.miller"
    And the user sets Password "Pass123!" and Confirm Password "DifferentPass123!"
    And the user clicks the "Save" button
    Then a pasword not match error message should be displayed under Confirm Password

  @addEmployee @addEmployee07
  Scenario: Fail to create login details with a username that is too short
    When the user enters First Name "Emily" and Last Name "Davis"
    And the user toggles on "Create Login Details"
    And the user sets Username "em"
    And the user clicks the "Save" button
    Then a minimum character error message should be displayed under Username

  @addEmployee @addEmployee08
  Scenario: Cancel employee creation
    When the user enters First Name "Michael" and Last Name "Wilson"
    And the user clicks the "Cancel" button
    Then the user should be redirected to the "Employee List" page
    And the employee "Michael Wilson" should not be created