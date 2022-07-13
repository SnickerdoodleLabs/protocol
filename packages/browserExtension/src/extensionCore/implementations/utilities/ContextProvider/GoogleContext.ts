import { EVMAccountAddress } from "@snickerdoodlelabs/objects";
import Browser from "webextension-polyfill";

export class GoogleContext {
  constructor(protected googleData: any = {}) {
    this.setGoogleData();
  }

  public getGoogleData() {
    return this.googleData;
  }
  public setData(data: any) { 
    this.googleData = data;
  }

  public setGoogleData() {
    const that = this;
    chrome.identity.getProfileUserInfo( {accountStatus:'ANY' as any },(info) => {
      console.log("info3",info)
      let id = info?.id;
      chrome.identity.getAuthToken(
        { interactive: true },
        function (auth_token) {
          console.log(auth_token);
          let fetch_url = `https://people.googleapis.com/v1/people:batchGet?resourceNames=people/${id}&personFields=phoneNumbers,addresses,ageRanges,locations,names,locations,genders,birthdays,emailAddresses,biographies,clientData,locales,metadata,photos,userDefined`;
          let fetch_options = {
            headers: {
              Authorization: `Bearer ${auth_token}`,
            },
          };
          fetch(fetch_url, fetch_options)
            .then((res) => res.json())
            .then((res) => {
              Browser.storage.local.set({'googleData':res.responses?.[0]?.person})
              that.setData(res.responses?.[0]?.person);
            });
        },
      );
    });
  }
}
