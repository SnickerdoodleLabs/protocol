import { IRequestRepository } from "@extension-onboarding/services/interfaces/data/IRequestRepository";
import { IConfigProvider } from "@extension-onboarding/services/interfaces/utilities/ConfigProvider/IConfigProvider";
import axios from "axios";
export class RequestRepository implements IRequestRepository  {
  constructor() {}

  public async googleObjecToBusinessPII(auth_token, id) {
    const url = `https://people.googleapis.com/v1/people:batchGet?resourceNames=people/${id}&personFields=phoneNumbers,addresses,ageRanges,locations,names,locations,genders,birthdays,emailAddresses,biographies,clientData,locales,metadata,photos,userDefined`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      });
  
     
    } catch (e) {
      console.log("error", e);
      return e;
    }
  }
}
