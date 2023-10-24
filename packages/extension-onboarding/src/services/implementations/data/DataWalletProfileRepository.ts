import { ISdlDataWallet, UnixTimestamp } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IDataWalletProfileRepository } from "@extension-onboarding/services/interfaces/data/IDataWalletProfileRepository";
import { PII } from "@extension-onboarding/services/interfaces/objects/";
import { convertToSafePromise } from "@extension-onboarding/utils/ResultUtils";

export class DataWalletProfileRepository
  implements IDataWalletProfileRepository
{
  constructor(private sdlDataWallet: ISdlDataWallet) {}
  public getProfile(): ResultAsync<PII, unknown> {
    return ResultUtils.combine([
      // below okAsync is used to skip type error coming from neverthrow find a smart way
      // tried defining global window d.ts no success
      okAsync("skip-type-error"),
      this.sdlDataWallet.getBirthday(),
      this.sdlDataWallet.getLocation(),
      this.sdlDataWallet.getGender(),
      this.sdlDataWallet.getAge(),
    ]).map(([_, birthday, country_code, gender, age]) => {
      return new PII(
        null,
        null,
        null,
        birthday ? new Date(birthday * 1000).toLocaleDateString() : null,
        country_code,
        null,
        null,
        gender,
        age,
      );
    });
  }

  public async setProfile(values: Partial<PII>): Promise<void> {
    const {
      given_name,
      family_name,
      email_address,
      date_of_birth,
      gender,
      country_code,
    } = values;
    [
      ...(given_name
        ? [
            await convertToSafePromise(
              this.sdlDataWallet.setGivenName(given_name),
            ),
          ]
        : []),
      ...(family_name
        ? [
            await convertToSafePromise(
              this.sdlDataWallet.setFamilyName(family_name),
            ),
          ]
        : []),
      ...(email_address
        ? [
            await convertToSafePromise(
              this.sdlDataWallet.setEmail(email_address),
            ),
          ]
        : []),
      ...(date_of_birth
        ? [
            await convertToSafePromise(
              this.sdlDataWallet.setBirthday(
                (+new Date(date_of_birth) / 1000) as UnixTimestamp,
              ),
            ),
          ]
        : []),
      ...(gender
        ? [await convertToSafePromise(this.sdlDataWallet.setGender(gender))]
        : []),
      ...(country_code
        ? [
            await convertToSafePromise(
              this.sdlDataWallet.setLocation(country_code),
            ),
          ]
        : []),
    ];
  }
}
