"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  //ADD FAVORITE STAR NEXT TO TITLE
  return $(`
      <li id="${story.storyId}">
      <span class="favorite-toggle">
      <i class="far fa-star"></i>
      </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


//ADD TOGGLE

$allStoriesList.on('click', '.favorite-toggle', function () {
  const $starElement = $(this).find('i');
  const $storyElement = $(this).closest('li');
  const storyId = $storyElement.attr('id');
  const story = storyList.stories.find(story => story.storyId === storyId);

  if ($starElement.hasClass('far')) {
    $starElement.removeClass('far').addClass('fas'); // Fill the star
    story.favorite = true;
    currentUser.addFavorite(story);
  } else {
    $starElement.removeClass('fas').addClass('far'); // Empty the star
    story.favorite = false;
    currentUser.removeFavorite(story);
  }

  localStorage.setItem(`${currentUser.username}-favorites`, JSON.stringify(currentUser.favorites));
  
});


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}



function putFavoritesOnPage() {
  $favoritesList.empty(); // Clear the existing list

  // Iterate through the favorited stories and append them to the list
  currentUser.favorites.forEach((story) => {
    const $storyItem = $(`<li></li>`);
    const $storyLink = $('<a></a>').attr('href', story.url).text(story.title);
   
   
    const $deleteStoryBtn = $('<button></button>').text('Remove');

    $storyItem.append($storyLink, $deleteStoryBtn);
    $favoritesList.append($storyItem);

    $deleteStoryBtn.on("click", async () => {
      try {
        await currentUser.removeFavorite(story.storyId);
        $storyItem.remove();
      } catch (error) {
        console.error('Failed to remove favorite:', error);
      }
    });
  });
  const $favoritesSection = $("#favorites-section");
  const $favoritesHeading = $("#favorites-heading");

  if (currentUser.favorites.length > 0) {
    $favoritesSection.show();
    $favoritesHeading.show();
  } else {
    $favoritesSection.hide();
    $favoritesHeading.hide();
  }
}

function putMyStoriesOnPage(){
  const $myStoriesList = $("#myStories-list");
  $myStoriesList.empty(); // Clear the existing list

  currentUser.ownStories.forEach((story) => {
    // Create elements for each story
    const $storyItem = $("<li></li>")
    const $storyLink = $("<a></a>").attr("href", story.url).text(story.title);
    const $deleteStoryBtn = $('<button></button>').text('Remove');

    // Append elements to the story item
    $storyItem.append($storyLink);
    $storyItem.append($deleteStoryBtn);
// Append the story item to the list
$myStoriesList.append($storyItem);

// Set up event handler for remove button
$deleteStoryBtn.on("click", async () => {
  try {
    await currentUser.removeStory(story.storyId);
    $storyItem.remove();
  } catch (error) {
    console.error('Failed to remove story:', error);
  }
 });
});
const $myStoriesSection = $("#myStories-section");
const $myStoriesHeading = $("#myStories-heading");

if (currentUser.ownStories.length > 0) {
  $myStoriesSection.show();
  $myStoriesHeading.show();
} else {
  $myStoriesSection.hide();
  $myStoriesHeading.hide();
}

}


async function formSubmission(evt){
  evt.preventDefault();
//REFERENCE VALUES FROM THE FORM
  const title = document.getElementById('add-story-title').value;
  const author = document.getElementById('add-story-author').value;
  const url = document.getElementById('add-story-url').value;

  const newStory = {title, author, url};

  const response = await storyList.addStory(currentUser, newStory);

  if (response.status === "success") {
    // Create the markup for the new story
    const $newStory = generateStoryMarkup(response.story);

    // Prepend the new story to the list of all stories
    $allStoriesList.prepend($newStory);
  }
}

const addStoryForm = document.getElementById('addStoryForm');
addStoryForm.addEventListener('submit', formSubmission);