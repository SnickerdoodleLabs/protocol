import { IDataWalletProfileRepository } from "@extension-onboarding/services/interfaces/data/IDataWalletProfileRepository";
import { PII } from "@extension-onboarding/services/interfaces/objects/";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { convertToSafePromise } from "@extension-onboarding/utils/ResultUtils";
import { Age, UnixTimestamp } from "@snickerdoodlelabs/objects";

declare const window: IWindowWithSdlDataWallet;

export class DataWalletProfileRepository
  implements IDataWalletProfileRepository
{
  public async getProfile(): Promise<PII> {
    const [given_name, family_name, email, birthday, country_code, gender] = [
      await convertToSafePromise(window.sdlDataWallet.getGivenName()),
      await convertToSafePromise(window.sdlDataWallet.getFamilyName()),
      await convertToSafePromise(window.sdlDataWallet.getEmail()),
      await convertToSafePromise(window.sdlDataWallet.getBirthday()),
      await convertToSafePromise(window.sdlDataWallet.getLocation()),
      await convertToSafePromise(window.sdlDataWallet.getGender()),
    ];
    return new PII(
      given_name,
      family_name,
      email,
      birthday ? new Date(birthday * 1000).toLocaleDateString() : null,
      country_code,
      null,
      null,
      gender,
    );
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
                (+new Date(date_of_birth) / 1000) as UnixTimestamp,
              ),
            ),
            await convertToSafePromise(
              window.sdlDataWallet.setAge(
                Age(
                  new Date().getFullYear() -
                    new Date(date_of_birth).getFullYear(),
                ),
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
