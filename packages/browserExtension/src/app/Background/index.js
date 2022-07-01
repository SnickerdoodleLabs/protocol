console.log("This is the background page.");
console.log("Put the background scripts here.");

let userInfo;

chrome.identity.getProfileUserInfo((info) => {
  userInfo = info;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension",
  );
  if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
  if (request.type === "SD_REQUEST_IDENTITY") {
    sendResponse(userInfo);
  }
});

function showStayHydratedNotification() {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "stay_hydrated.png",
    title: "Time to Hydrate",
    message: "Everyday I'm Guzzlin'!",
    buttons: [{ title: "Keep it Flowing." }],
    priority: 0,
  });
}

// Google OAuth2
const API_KEY = "AIzaSyB4-1qbu_jTBJ6WzB-mQukjJOu-4trvpLQ";
let user_signed_in = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "dataRequest" && request.obj === null) {
    let current_userID = "me";
    chrome.identity.getProfileUserInfo(
      { accountStatus: "ANY" },
      function (userInfo) {
        console.log(userInfo);
        current_userID = userInfo.id;
      },
    );
    chrome.identity.getAuthToken({ interactive: true }, function (auth_token) {
      console.log(auth_token);
      console.log(current_userID);
      let fetch_url = `https://people.googleapis.com/v1/people:batchGet?resourceNames=people/${current_userID}&personFields=phoneNumbers,addresses,ageRanges,locations,names,locations,genders,birthdays,emailAddresses,biographies,clientData,locales,metadata,photos,userDefined`;
      let fetch_options = {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      };
      fetch(fetch_url, fetch_options)
        .then((res) => res.json())
        .then((res) => {
          console.log("DATA", res.responses?.[0]?.person);
          chrome.runtime.sendMessage({
            message: "cardData",
            userData: res.responses?.[0]?.person,
          });
        });
    });
    sendResponse(true);
  }
});
