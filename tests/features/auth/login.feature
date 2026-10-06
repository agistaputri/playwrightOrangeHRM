Feature: User Login

  @login @login01
  Scenario: Successful login with valid username and password
    Given the user is on the login page
    When the user enters valid username and valid password
    And clicks the login button
    Then the user should be redirected to the dashboard

  @login @login02
  Scenario: Unsuccessful login with invalid username and invalid password
    Given the user is on the login page
    When the user enters invalid username and invalid password
    And clicks the login button
    Then the user should not be redirected to the dashboard
    And the user should see an invalid credential error message

  @login @login03
  Scenario: Unsuccessful login with invalid username and valid password
    Given the user is on the login page
    When the user enters invalid username and valid password
    And clicks the login button
    Then the user should not be redirected to the dashboard
    And the user should see an invalid credential error message

  @login @login04
  Scenario: Unsuccessful login with valid username and invalid password
    Given the user is on the login page
    When the user enters valid username and invalid password
    And clicks the login button
    Then the user should not be redirected to the dashboard
    And the user should see an invalid credential error message

  @login @login05
  Scenario: Unsuccessful login with empty username and password
    Given the user is on the login page
    When the user enters empty username and empty password
    And clicks the login button
    Then the user should not be redirected to the dashboard
    And the user should see required error message

  @login @login06
  Scenario: Unsuccessful login with empty username and valid password
    Given the user is on the login page
    When the user enters empty username and valid password
    And clicks the login button
    Then the user should not be redirected to the dashboard
    And the user should see required error message

  @login @login07
  Scenario: Unsuccessful login with valid username and empty password
    Given the user is on the login page
    When the user enters valid username and empty password
    And clicks the login button
    Then the user should not be redirected to the dashboard
    And the user should see required error message

  @login @login08
  Scenario: Verify user can reset the password with valid email address
    Given the user is on the login page
    When the user clicks the forgot password link
    And the user enters valid email address
    And clicks the reset password button
    Then the user should be redirected to the password reset page

  @login @login09
  Scenario: Verify user can not reset the password with invalid email address
    Given the user is on the login page
    When the user clicks the forgot password link
    And the user enters invalid email address
    And clicks the reset password button
    And the user should see an invalid credential error message
    
  @login @login10
  Scenario: Verify user can not reset the password with empty email address
    Given the user is on the login page
    When the user clicks the forgot password link
    And clicks the reset password button
    And the user should see required error message

  @login @login11
  Scenario: Verify user can cancel reset password
    Given the user is on the login page
    When the user clicks the forgot password link
    And clicks the cancel button
    Then the user should be redirected to the login page






