import { ROUTES } from "./constants";
import { RootStackParamList } from "./types";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import Login from "@screens/Login";
import Register from "@screens/Register";
import Dashboard from "@screens/Dashboard";
import Onboarding from "@screens/Onboarding";
import Header from "@components/atoms/Header";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { STRINGS } from "@utils/strings";
import ForgotPassword from "@screens/ForgotPassword";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {token ? (
            <Stack.Group
              screenOptions={{ header: (props) => <Header {...props} /> }}
            >
              <Stack.Screen name={ROUTES.ONBOARDING} component={Onboarding} />
              <Stack.Screen name={ROUTES.LOGIN} component={Login} />
              <Stack.Screen
                name={ROUTES.FORGOTPASSWORD}
                component={ForgotPassword}
              />
              <Stack.Screen name={ROUTES.REGISTER} component={Register} />
            </Stack.Group>
          ) : (
            <Stack.Group
              screenOptions={{ header: (props) => <Header {...props} /> }}
            >
              <Stack.Screen name={ROUTES.DASHBOARD} component={Dashboard} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default RootNavigator;
