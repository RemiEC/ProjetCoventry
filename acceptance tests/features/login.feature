Feature: registering as a new user and loggining in as an existing user
	The user should be able to register a new account and log in as existing user

	Scenario: register an account
		Given The browser is open on the home page
		When I click on the "register" link
		When I enter "faraha11" in the "user" field
		When I enter "password" in the "pass" field
		When I attach an image called "avatar" in "profileUpload"
		When I click the submit button
		Then take a screenshot called "registered_user"
		Then the title should be "Main Page"
		Then I should be welcomed as "faraha11" on the home page 
		Then there should be a link to add a question 

	Scenario: logging out
		When I click on the "logout" link
		Then the title should be "Main Page"

	Scenario: logging in as existing user
		When I enter "faraha11" in the "userLogin" field
		When I enter "password" in the "passLogin" field
		When I click the login button
		Then take a screenshot called "logged_in_existing"
		Then the title should be "Main Page"
		Then I should be welcomed as "faraha11" on the home page 
		Then there should be a link to add a question
