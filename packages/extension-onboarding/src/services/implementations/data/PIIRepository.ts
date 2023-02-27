/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IAxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";
import { AjaxError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IPIIRepository } from "@extension-onboarding/services/interfaces/data/IPIIRepository";
import {
  IGoogleObject,
  PII,
} from "@extension-onboarding/services/interfaces/objects";

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
        return this.googleObjectToBusinessPII(
          // @ts-ignore
          googleObject.responses[0].person as IGoogleObject,
        );
      });
  }

  private googleObjectToBusinessPII(googleObject: IGoogleObject) {
    const { names, emailAddresses, birthdays, phoneNumbers, photos, genders } =
      googleObject;

    const given_name = names?.[0]?.givenName ?? null;
    const family_name = names?.[0]?.familyName ?? null;
    const email_address = emailAddresses?.[0]?.value ?? null;
    const date_of_birth = birthdays?.[0]?.date
      ? new Date(
          Object.values(birthdays?.[0]?.date).join(","),
        ).toLocaleDateString()
      : null;
    const phone_number = phoneNumbers?.[0]?.canonicalForm ?? null;
    const photo_url = photos?.[0]?.url ?? null;
    const gender = genders?.[0]?.value ?? null;
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
