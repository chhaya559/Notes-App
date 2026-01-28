import { useEffect } from "react";
import { TextInput, TextStyle } from "react-native";
import { preloadFonts } from "@utils/constants";
import { preloadImages } from "@utils/images";
import RootNavigator from "./src/navigation/RootNavigator";
import { store, persistor } from "./src/redux/store/index";
import "./src/localization";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

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
      preloadImages();
      await preloadFonts();
      SplashScreen.hideAsync();
    })();
  }, []);

  return (
    <>
      {/* <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}> */}
      <Provider store={store}>
        {/* <PersistGate persistor={persistor} loading={null}> */}
        <RootNavigator />
        <Toast />
        {/* </PersistGate> */}
      </Provider>
      {/* </SafeAreaView>
      </SafeAreaProvider> */}
    </>
  );
}
