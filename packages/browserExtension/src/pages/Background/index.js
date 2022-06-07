console.log("This is the background page.");
console.log("Put the background scripts here.");

const API_KEY = "AIzaSyB4-1qbu_jTBJ6WzB-mQukjJOu-4trvpLQ";
let user_signed_in = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Google OAuth2 Access Token
  if (request.message === "test" && request.obj === null) {
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
          console.log("TestDATA", res.responses[0].person);
          chrome.runtime.sendMessage({
            message: "cardData",
            userData: res.responses[0].person,
          });
        });
    });
    sendResponse(true);
  }
});
