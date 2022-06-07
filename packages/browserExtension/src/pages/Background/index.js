console.log("This is the background page.");
console.log("Put the background scripts here.");

const API_KEY = "AIzaSyB4-1qbu_jTBJ6WzB-mQukjJOu-4trvpLQ";
let user_signed_in = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Google OAuth2 Access Token
  if (request.message === "get_access_token" && request.obj === null) {
    chrome.identity.getAuthToken({ interactive: true }, function (auth_token) {
      let fetch_url = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${auth_token}`;
      let fetch_options = {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      };
      fetch(fetch_url, fetch_options)
        .then((res) => res.json())
        .then((res) => {
          chrome.runtime.sendMessage({ message: "cardData", userData: res });
        });
    });
    sendResponse(true);
  } else if (request.message === "get_profile") {
    chrome.identity.getProfileUserInfo(
      { accountStatus: "ANY" },
      function (userInfo) {
        console.log(userInfo);
        current_user = userInfo.id;
      },
    );
    sendResponse(true);
  } else if (request.message === "get_contacts") {
    chrome.identity.getAuthToken({ interactive: true }, function (auth_token) {
      let fetch_url = `https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${API_KEY}`;
      let fetch_options = {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      };
      fetch(fetch_url, fetch_options)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.memberCount) {
            const members = res.memberResourceNames;
            fetch_url = `https://people.googleapis.com/v1/people:batchGet?personFields=addresses,ageRanges,names,locations,genders,birthdays,emailAddresses,biographies&key=${API_KEY}`;

            members.forEach((member) => {
              fetch_url += `&resourceNames=${encodeURIComponent(member)}`;
            });

            fetch(fetch_url, fetch_options)
              .then((res) => res.json())
              .then((res) => {
                console.log(res);
              });
          }
        });
    });
  }
});
