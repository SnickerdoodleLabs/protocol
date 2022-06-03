console.log('This is the background page.');
console.log('Put the background scripts here.');

let userInfo;

chrome.identity.getProfileUserInfo((info) => {
  userInfo = info
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting === "hello")
      sendResponse({farewell: "goodbye"});
    if ( request.type === "SD_REQUEST_IDENTITY" ) {
      sendResponse(userInfo)
    }
  }
);

function showStayHydratedNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'stay_hydrated.png',
    title: 'Time to Hydrate',
    message: 'Everyday I\'m Guzzlin\'!',
    buttons: [
      { title: 'Keep it Flowing.' }
    ],
    priority: 0
  });
}