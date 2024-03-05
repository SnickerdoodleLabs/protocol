import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { DiscordProfile } from "@snickerdoodlelabs/objects";
import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface CookieVaultContext {
  discordAccounts: DiscordProfile[];
  fetchDiscordAccounts: () => void;
}

const CookieVaultContext = createContext<CookieVaultContext>(
  {} as CookieVaultContext,
);

export const CookieVaultContextProvider: FC = ({ children }) => {
  const { sdlDataWallet } = useDataWalletContext();
  const [discordAccounts, setDiscordAccounts] = useState<DiscordProfile[]>([]);
  useEffect(() => {
    fetchDiscordAccounts();
  }, []);

  const fetchDiscordAccounts = useCallback(() => {
    sdlDataWallet.discord.getUserProfiles().map((profiles) => {
      setDiscordAccounts(profiles);
    });
  }, [sdlDataWallet]);

  return (
    <CookieVaultContext.Provider
      value={{ fetchDiscordAccounts, discordAccounts }}
    >
      {children}
    </CookieVaultContext.Provider>
  );
};

export const useCookieVaultContext = () => useContext(CookieVaultContext);
