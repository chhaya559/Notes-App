import { useEffect } from "react";

import { TextInput, TextStyle } from "react-native";

import { preloadFonts } from "@utils/constants";
import { preloadImages } from "@utils/images";

import RootNavigator from "./src/navigation/RootNavigator";
import store from "./src/redux/store/index";
import "./src/localization";

import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";

SplashScreen.preventAutoHideAsync();
interface ExtendedText extends Text {
  defaultProps: {
    allowFontScaling: boolean;
    style?: TextStyle;
  };
}

interface ExtendedTextInput extends TextInput {
  defaultProps: {
    allowFontScaling: boolean;
  };
}
export default function App() {
  (Text as unknown as ExtendedText).defaultProps = { allowFontScaling: false };
  (TextInput as unknown as ExtendedTextInput).defaultProps = {
    allowFontScaling: false,
  };
  // Preload images and fonts before rendering the app
  // This ensures that the app is ready to display content without a loading screen
  useEffect(() => {
    (async () => {
      await Promise.all([preloadImages(), preloadFonts()]);
      SplashScreen.hideAsync();
    })();
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
