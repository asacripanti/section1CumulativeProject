"use strict";

//USING JQUERY?

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitClick(evt){
   //DISPLAYS FORM AND INPUTS
   $("#myStories-section").hide();
   $("#favorites-section").hide();
  evt.preventDefault();
  const storyForm = document.getElementById('addStoryForm');

  // Remove the "display: none;" style attribute to make the form visible
  storyForm.removeAttribute('style');
}


$body.on("click", "#nav-favorites", navFavoritesClick);

function navFavoritesClick(){
  $('#addStoryForm').hide();
  $("#myStories-section").hide();
  putFavoritesOnPage();
  console.log(currentUser);
}

const navBarSubmit = document.querySelector('#nav-submit');
navBarSubmit.addEventListener('click', navSubmitClick);


$body.on("click", "#nav-myStories", navMyStoriesClick);


function navMyStoriesClick(evt){
  $('#addStoryForm').hide();
  $("#favorites-section").hide();
  putMyStoriesOnPage();

}