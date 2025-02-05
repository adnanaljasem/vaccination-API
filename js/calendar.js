// Client ID and API key from the Developer Console
var CLIENT_ID =
  "734294667401-e89vq2f6af7oggp5475lct3kn06423oe.apps.googleusercontent.com";
var API_KEY = "AIzaSyBetRqaW753YX3fALEaJagSTB02RZjQqZ0";
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES =
  "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events";
var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}
/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      },
      function (error) {
        appendPre(JSON.stringify(error, null, 2));
      }
    );
}
/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
}
/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById("content");
  var textContent = document.createTextNode(message + "\n");
  pre.appendChild(textContent);
}
/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events
    .list({
      // This calendarId differs regarding our calenders of Zurich, Bern and Geneva
      // Zurich calendarID = c_fkrdk17ovdm445b09983i03s5g@group.calendar.google.com
      // Bern calendarID = c_ton66fds60s03rfq5m4fc4ooe4@group.calendar.google.com
      // Geneva calendarID = c_0k3255mug3blnqd41tl04mches@group.calendar.google.com
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    })
    .then(function (response) {
      var events = response.result.items;
      appendPre("Upcoming events:");
      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          appendPre(event.summary + " (" + when + ")");
        }
      } else {
        appendPre("No upcoming events found.");
      }
    });
}
function createEvent(calendarID) {
  // Refer to the JavaScript quickstart on how to setup the environment:
  // https://developers.google.com/calendar/quickstart/js
  // Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
  // stored credentials.
  var event = {
    summary: "Powercoders Event Group 5",
    location: "Zurich",
    description: "A chance to hear more about Google's developer products.",
    start: {
      dateTime: "2021-11-07T09:00:00-07:00",
      timeZone: "Europe/Zurich",
    },
    end: {
      dateTime: "2021-11-07T10:00:00-07:00",
      timeZone: "Europe/Zurich",
    },
  };
  var request = gapi.client.calendar.events.insert({
    // This calendarId differs regarding our calenders of Zurich, Bern and Geneva
    // Zurich calendarID = c_fkrdk17ovdm445b09983i03s5g@group.calendar.google.com
    // Bern calendarID = c_ton66fds60s03rfq5m4fc4ooe4@group.calendar.google.com
    // Geneva calendarID = c_0k3255mug3blnqd41tl04mches@group.calendar.google.com
    calendarId: calendarID,
    resource: event,
  });
  request.execute(function (event) {
    appendPre("Event created: " + event.htmlLink);
  });
}
document
  .getElementById("create-event-button")
  .addEventListener("click", createEvent);

// We group 5 has added
document.getElementById("zhbutton").onclick = zhClic;

function zhClic() {
  var id = "c_fkrdk17ovdm445b09983i03s5g@group.calendar.google.com";
  createEvent(id);
}