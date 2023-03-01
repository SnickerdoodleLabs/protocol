import { SnickerdoodleCore } from '@snickerdoodlelabs/core'
import {
  AccountAddress,
  BigNumberString,
  DataPermissions,
  EChain,
  EVMContractAddress,
  Invitation,
  IpfsCID,
  ISnickerdoodleCore,
  LanguageCode,
  Signature,
  UnsupportedLanguageError,
} from '@snickerdoodlelabs/objects'
import { ResultAsync } from 'neverthrow'
import * as React from 'react'
import { MobileCore } from '@snickerdoodlelabs/mobile/Services/implementations/Gateway'

export const AppCtx = React.createContext<any | null>(null)

const AppContextProvider = ({ children }: any) => {
  const [mobileCore, setMobileCore] = React.useState<MobileCore>(
    new MobileCore(),
  )

  const initConnection = async () => {
    try {
      const sign =
        '0x91aa05467f4fa179ada6a8f537503a649f7ef2e1c0b63178b251b0afb37bbc5138c2df394c50f435721e991e17e44b33fb4c8ac5736bb4f2d58411b6a77998401b'
      const acc = '0xbaa1b174fadca4a99cbea171048edef468c5508b'
      mobileCore
        .getAccountService()
        .unlock(
          acc as AccountAddress,
          sign as Signature,
          EChain.EthereumMainnet,
          'en' as LanguageCode,
        )
      console.log('Unlock Completed!')
    } catch (err) {
      console.log({ err })
    }
  }

  return (
    <AppCtx.Provider
      value={{
        mobileCore,
        initConnection,
      }}
    >
      {children}
    </AppCtx.Provider>
  )
}

export default AppContextProvider
