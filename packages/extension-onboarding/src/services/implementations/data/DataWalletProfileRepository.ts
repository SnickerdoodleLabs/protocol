import { IDataWalletProfileRepository } from "@extension-onboarding/services/interfaces/data/IDataWalletProfileRepository";
import { PII } from "@extension-onboarding/services/interfaces/objects/";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { convertToSafePromise } from "@extension-onboarding/utils/ResultUtils";
import { Birthday, UnixTimestamp } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

declare const window: IWindowWithSdlDataWallet;

export class DataWalletProfileRepository
  implements IDataWalletProfileRepository
{
  public getProfile(): ResultAsync<PII, unknown> {
    return ResultUtils.combine([
      // below okAsync is used to skip type error coming from neverthrow find a smart way
      // tried defining global window d.ts no success
      okAsync("skip-type-error"),
      window.sdlDataWallet.getBirthday(),
      window.sdlDataWallet.getLocation(),
      window.sdlDataWallet.getGender(),
      window.sdlDataWallet.getAge(),
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
              window.sdlDataWallet.setGivenName(given_name),
            ),
          ]
        : []),
      ...(family_name
        ? [
            await convertToSafePromise(
              window.sdlDataWallet.setFamilyName(family_name),
            ),
          ]
        : []),
      ...(email_address
        ? [
            await convertToSafePromise(
              window.sdlDataWallet.setEmail(email_address),
            ),
          ]
        : []),
      ...(date_of_birth
        ? [
            await convertToSafePromise(
              window.sdlDataWallet.setBirthday(
                (+new Date(date_of_birth) / 1000) as Birthday,
              ),
            ),
          ]
        : []),
      ...(gender
        ? [await convertToSafePromise(window.sdlDataWallet.setGender(gender))]
        : []),
      ...(country_code
        ? [
            await convertToSafePromise(
              window.sdlDataWallet.setLocation(country_code),
            ),
          ]
        : []),
    ];
  }
}
