Feature: Update Employee

  Background:
    Given the user is logged in as Admin
    And the user navigates to the "Add Employee" page

  @updateEmployee @updateEmployee01
  Scenario: Successfully update full personal details after creating a new user
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user fills Personal Details with:
      | firstName       | David          |
      | middleName      | John           |
      | lastName        | Smith          |
      | employeeId      | EMP183         |
      | otherId         | OTH998         |
      | driversLicense  | DL-9928312     |
      | licenseExpiry   | 2030-12-31     |
      | nationality     | Indonesian     |
      | maritalStatus   | Married        |
      | dateOfBirth     | 1995-08-17     |
      | gender          | Male           |
    And the user clicks the Save button for Personal Details
    Then a successfully updated message should be displayed

  @updateEmployee @updateEmployee02
  Scenario: Successfully update full personal details from click edit button on employee list
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user navigates to the "Employee List" page
    When the user searches for "John Doe" in employee list
    When the user clicks the edit button for employee "John Doe"
    When the user navigates to "Personal Details" page
    And the user fills Personal Details with:
      | firstName       | John           |
      | middleName      | Doe            |
      | lastName        | Smith          |
      | employeeId      | EMP183         |
      | otherId         | OTH998         |
      | driversLicense  | DL-9928312     |
      | licenseExpiry   | 2030-12-31     |
      | nationality     | Indonesian     |
      | maritalStatus   | Married        |
      | dateOfBirth     | 1995-08-17     |
      | gender          | Male           |
    And the user clicks the Save button for Personal Details
    Then a successfully updated message should be displayed 

  @updateEmployee @updateEmployee03
  Scenario: Successfully update personal details with attachment
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user clicks the attachment button
    And the user uploads a file with name "OrangeHRM.pdf" on Personal Details
    And a successfully saved message should be displayed
  
   @updateEmployee @updateEmployee04
  Scenario: Fail to update personal details with not supported file type attachment
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user clicks the attachment button
    And the user uploads a file with name "OrangeHRM.webp" on Personal Details
    Then a file type not supported message should be displayed

   @updateEmployee @updateEmployee05
  Scenario: Fail to update personal details with > 1MB attachment
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user clicks the attachment button
    And the user uploads a file with name "more1mb.pdf" on Personal Details
    Then a file too large message should be displayed

   @updateEmployee @updateEmployee06
  Scenario: Fail to update personal details with toogle attachment ON but not upload file
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user clicks the attachment button
    And the user clicks the Save button for attachment
    Then a required error message should be displayed under attachment section

  @updateEmployee @updateEmployee07
  Scenario: Successfully delete attachment on personal details
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user clicks the attachment button
    And the user uploads a file with name "OrangeHRM.pdf" on Personal Details
    Then a successfully saved message should be displayed
    When the user deletes the attachment "OrangeHRM.pdf"
    And the user confirms deleting the attachment
    Then a successfully deleted message should be displayed
  
  @updateEmployee @updateEmployee08
  Scenario: Successfully cancel delete attachment on personal details
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user clicks the attachment button
    And the user uploads a file with name "OrangeHRM.pdf" on Personal Details
    Then a successfully saved message should be displayed
    When the user deletes the attachment "OrangeHRM.pdf"
    Then the user cancels deleting the attachment

   @updateEmployee @updateEmployee09
  Scenario: Successfully edit attachment on personal details
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user clicks the attachment button
    And the user uploads a file with name "OrangeHRM.pdf" on Personal Details
    Then a successfully saved message should be displayed
    When user edits the file with name "OrangeHRM.pdf" on Personal Details
    And the user uploads a new file with name "OrangeHRM.png"
    Then a successfully updated message should be displayed
  

  @updateEmployee @updateEmployee10
  Scenario: Successfully download attachment on personal details
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user clicks the attachment button
    And the user uploads a file with name "OrangeHRM.pdf" on Personal Details
    Then a successfully saved message should be displayed
    When user downloads the file with name "OrangeHRM.pdf" on Personal Details
    Then the file should be downloaded successfully

   @updateEmployee @updateEmployee11
  Scenario: Successfully add another attachment on personal details
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user clicks the attachment button
    And the user uploads a file with name "OrangeHRM.pdf" on Personal Details
    Then a successfully saved message should be displayed
    When the user clicks the attachment button
    And the user uploads a file with name "OrangeHRM.png" on Personal Details
    And a successfully saved message should be displayed
     
  @updateEmployee @updateEmployee12
  Scenario: Successfully update full contact details
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user navigates to "Contact Details" page
    And the user fills Contact Details with:
      | street1          | Jl. Jendral Sudirman No. 4 |
      | street2          | Gedung Artha Lt. 12        |
      | city             | Jakarta Selatan            |
      | state            | DKI Jakarta                |
      | zipCode          | 12190                      |
      | country          | Indonesia                  |
      | homeTelephone    | 0215551234                 |
      | mobile           | 081234567890               |
      | workTelephone    | 0215559999                 |
    And the user enters a random email on "Work Email"
    And the user enters a random email on "Other Email"
    And the user clicks the Save button for Contact Details
    Then a successfully updated message should be displayed 
    
  @updateEmployee @updateEmployee13
  Scenario: Verify error when user enters invalid telephone
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user navigates to "Contact Details" page
    And the user fills Contact Details with:
      | street1          | Jl. Jendral Sudirman No. 4 |
      | street2          | Gedung Artha Lt. 12        |
      | city             | Jakarta Selatan            |
      | state            | DKI Jakarta                |
      | zipCode          | 12190                      |
      | country          | Indonesia                  |
      | homeTelephone    | 0vdsd5551234               |
      | mobile           | sdgsdg!@$@%^               |
      | workTelephone    | de+@#$#@asda               |
    And the user clicks the Save button for Contact Details
    And a restricted characters error message should be displayed under home telephone
    And a restricted characters error message should be displayed under mobile telephone
    Then a restricted characters error message should be displayed under work telephone

  @updateEmployee @updateEmployee14
  Scenario: Verify error when user enters the same email for work and other on Contact Details
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user navigates to "Contact Details" page
    And the user fills Contact Details with:
      | street1          | Jl. Jendral Sudirman No. 4 |
      | street2          | Gedung Artha Lt. 12        |
      | city             | Jakarta Selatan            |
      | state            | DKI Jakarta                |
      | zipCode          | 12190                      |
      | country          | Indonesia                  |
      | workEmail        | yeyy@gmail.com             |
      | otherEmail       | yeyy@gmail.com             |
    And the user clicks the Save button for Contact Details
    Then a same email error message should be displayed under other email

  @updateEmployee @updateEmployee15
  Scenario: Verify error when user enters the existing email on Contact Details
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user navigates to "Contact Details" page
    And the user fills Contact Details with:
      | street1          | Jl. Jendral Sudirman No. 4 |
      | street2          | Gedung Artha Lt. 12        |
      | city             | Jakarta Selatan            |
      | state            | DKI Jakarta                |
      | zipCode          | 12190                      |
      | country          | Indonesia                  |
      | workEmail        | test@gmail.com             |
    And the user clicks the Save button for Contact Details
    Then an already existing error message should be displayed under work email
     
     
  @updateEmployee @updateEmployee16
  Scenario: Successfully update full emergency contacts
    When the user enters First Name "John" and Last Name "Doe"
    And the user enters a random custom Employee ID
    And the user clicks the "Save" button
    Then a successfully saved message should be displayed
    And the user should be redirected to the "Personal Details" page for the new employee
    When the user navigates to "Emergency Contacts" page
    And the user adds a new emergency contact with details:
      | name         | Jane Doe            |
      | relationship | Spouse              |
      | homeTelephone| 021999888           |
      | mobile       | 081987654321        |
      | workTelephone| 0215554321          |
    And the user clicks the Save button for Emergency Contacts
    Then a successfully saved message should be displayed