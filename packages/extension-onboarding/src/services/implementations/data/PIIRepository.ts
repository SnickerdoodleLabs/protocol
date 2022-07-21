import { IGoogleObject } from "@extension-onboarding/services/interfaces/data/IGoogleObject";
import { IPIIRepository } from "@extension-onboarding/services/interfaces/data/IPIIRepository";
import { PII } from "@extension-onboarding/services/interfaces/objects";
import { AjaxError } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { IAxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";

export class PIIRepository implements IPIIRepository {
  constructor(protected ajaxUtil: IAxiosAjaxUtils) {}
  public fetchPIIFromGoogle(
    auth_token: string,
    googleId: string,
  ): ResultAsync<PII, AjaxError> {
    return this.ajaxUtil
      .get(
        new URL(
          `https://people.googleapis.com/v1/people:batchGet?resourceNames=people/${googleId}&personFields=phoneNumbers,addresses,ageRanges,locations,names,locations,genders,birthdays,emailAddresses,biographies,clientData,locales,metadata,photos,userDefined`,
        ),
        { headers: { Authorization: `Bearer ${auth_token}` } },
      )
      .map((googleObject) => {
        console.log("fet",googleObject)
        // @ts-ignore
        return this.googleObjectToBusinessPII(googleObject.responses[0].person as IGoogleObject);
      });
  }

  private googleObjectToBusinessPII(googleObject: IGoogleObject) {
    const given_name = googleObject?.names?.[0]?.givenName;
    const family_name = googleObject?.names?.[0]?.familyName;
    const email_address = googleObject?.emailAddresses?.[0]?.value;
    const date_of_birth = `${googleObject?.birthdays?.[0]?.date.day}/${googleObject?.birthdays?.[0]?.date.month}/${googleObject?.birthdays?.[0]?.date.year}`;
    const phone_number = googleObject?.phoneNumbers?.[0]?.canonicalForm;
    const photo_url = googleObject?.photos?.[0]?.url;
    const gender = googleObject?.genders?.[0]?.value;
    // TODO Country code

    return new PII(
      given_name,
      family_name,
      email_address,
      date_of_birth,
      null,
      phone_number,
      photo_url,
      gender,
    );
  }
}
