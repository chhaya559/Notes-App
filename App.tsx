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
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PersistGate } from "redux-persist/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useTheme from "@hooks/useTheme";

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

  useEffect(() => {
    (async () => {
      preloadImages();
      await preloadFonts();
      SplashScreen.hideAsync();
    })();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MainApp />
      </PersistGate>
    </Provider>
  );
}

function MainApp() {
  const { darkMode, Colors } = useTheme();

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: Colors.background }}>
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: Colors.background }}
      >
        <KeyboardProvider>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: Colors.background }}
            edges={["bottom"]}
          >
            <RootNavigator />
            <StatusBar style={darkMode ? "light" : "dark"} />
            <Toast />
          </SafeAreaView>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
