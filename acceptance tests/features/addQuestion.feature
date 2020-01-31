Feature: adding an answer
	The user should be able to ask a question if they are logged in

	Scenario: logging in as an existing user
		Given The browser is open on the home page
		When I click on the "register" link
		When I enter "faraha12" in the "user" field
		When I enter "password" in the "pass" field
		When I attach an image called "avatar" in "profileUpload"
		When I click the submit button
		Then the title should be "Main Page"
		Then I should be welcomed as "faraha12" on the home page 
		Then there should be a link to add a question

	Scenario: adding a question
		When I click on the "postquestion" link
		Then take a screenshot called "opened_add_question_page"
		Then the title should be "Add a Question"
		When I enter "Is this working?" in the "questionTitle" field
		When I enter "I tried it today and it broke on me" in the "questionDesc" field
		When I attach an image called "sun" in "questionImageUpload"
		When I click the post button
		Then take a screenshot called "homepage_with_question"
		Then the title should be "Main Page"
		Then the question number should be "1"
	
	Scenario: searching for a question
		When I enter "working" in the "typeQuestion" field
		When I click the search button
		Then take a screenshot called "searching_for_question"
		Then the title should be "Main Page"
		Then the question number should be "1"
		When I clear the "typeQuestion" field
		When I enter "noooooooo" in the "typeQuestion" field
		When I click the search button
		Then take a screenshot called "searching_for_question_no_match"
		Then there should be no questions on the home page