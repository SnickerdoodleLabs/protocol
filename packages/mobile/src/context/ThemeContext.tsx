import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";

type ThemeContextType = {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  colors: {
    background: string;
    backgroundSecondary: string;
    border: string;
    iconColor: string;
    title: string;
    tokenText: string;
    description: string;
    bottomTabBackground: string;
    bottomTabColor: string;
    // Extend this type as needed
  };
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

type ThemeContextProviderProps = {
  children: ReactNode;
};

export const ThemeContextProvider = ({
  children,
}: ThemeContextProviderProps) => {
  const colorScheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(colorScheme === "dark");

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
        setIsDarkMode(colorScheme === "dark");
      },
    );
    return () => subscription.remove();
  }, []);

  const theme: ThemeContextType = {
    isDarkMode,
    setIsDarkMode,
    colors: {
      background: isDarkMode ? "#19172B" : "#fff",
      backgroundSecondary: isDarkMode ? "#2E2946" : "#FAFAFA",
      bottomTabBackground: isDarkMode ? "#3D365B" : "#FAFAFA",
      bottomTabColor: isDarkMode ? "#E8E5F0" : "#645997",
      border: isDarkMode ? "#3D365B" : "#EEEEEE",
      title: isDarkMode ? "#DDD6FF" : "#424242",
      tokenText: isDarkMode ? "#E8E5F0" : "#616161",
      description: isDarkMode ? "#A8A7B4" : "#616161",
      iconColor: isDarkMode ? "#DDD6FF" : "#9E9E9E",
      // Add any additional colors you need here
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);
