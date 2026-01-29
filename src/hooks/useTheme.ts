import { useColorScheme } from "react-native";
import { setTheme } from "@redux/slice/Theme";
import { THEME, ThemeColors } from "@theme/constants";
import { DarkColors } from "@theme/darkTheme";
import { LightColors } from "@theme/lightTheme";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";

const useTheme = () => {
  const dispatch = useDispatch();
  const savedTheme = useSelector((state: RootState) => state.common.theme);
  const deviceScheme = useColorScheme();

  // decide actual theme
  let currentTheme: THEME;

  if (savedTheme === THEME.DEVICE) {
    currentTheme = deviceScheme === "dark" ? THEME.DARK : THEME.LIGHT;
  } else {
    currentTheme = savedTheme;
  }

  const Colors: ThemeColors =
    currentTheme === THEME.DARK ? DarkColors : LightColors;

  const toggleTheme = () => {
    dispatch(setTheme(currentTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK));
  };

  const changeTheme = (theme: THEME) => {
    dispatch(setTheme(theme));
  };

  return {
    Colors,
    darkMode: currentTheme === THEME.DARK,
    currentTheme,
    toggleTheme,
    changeTheme,
  };
};

export default useTheme;
