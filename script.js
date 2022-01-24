const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

// arr of obj for the bookmarks for local storage || you can build up empty obj as well{}
let bookmarks = [];

// Show Modal, Focus on Input
function showModal() {
  modal.classList.add('show-modal');
  // focus on the website name element
  websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
// in order to close the modal with any click outside of it
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate Form  || regular expressions (adding slash at the begining & at the and and g in the end)
function validate(nameValue, urlValue) {
  const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields.');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('Please provide a valid web address.');
    return false;
  }
  // Valid
  return true;
}

// Build Bookmarks
function buildBookmarks() {
  // Remove all bookmark elements,fixing the problem with forEach dlting(every time we try to build,before forEach, remove everything from the container)
  bookmarksContainer.textContent = '';
  // Build items
  bookmarks.forEach((bookmark) => {
    // destructuring
    const { name, url } = bookmark;
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Close Icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    // when you hover over the icon you can see the dlt bookmark
    closeIcon.setAttribute('title', 'Delete Bookmark');
    // run a function,similar to eventlistener.When you dlt a bookmark
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
    // Favicon / Link Container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    // Favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', 'Favicon');
    // Link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    // this is for the UI
    link.textContent = name;
    // Append to bookmarks container
    // using append instead of appendChild cause allow you to append more than one thing.
    // append progressively 
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Fetch bookmarks
function fetchBookmarks() {
  // Get bookmarks from localStorage if available
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // Create bookmarks array in localStorage
    bookmarks = [
      {
        name: 'Google',
        url: 'https://google.com',
      },
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
  // Loop through the bookmarks array|| i=index of the arr
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      // whatever index it is, remove one obj,so takes 2 param(what, how many)
      bookmarks.splice(i, 1);
    }
  });
  // Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  // re-populate the dom  
  fetchBookmarks();
}
// handle data from form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  // Add 'https://' if not there
  if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
    urlValue = `https://${urlValue}`;
  }
  // Validate
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  // Set bookmark object, add to array
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  // this is going to send tour bookmarks to the arr
  bookmarks.push(bookmark);
  // Set bookmarks in localStorage, fetch, reset input fields(passing in our bookmarks arr)
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  // reset's the values  in the modal after save
  bookmarkForm.reset();
  // focus on the el input
  websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();
