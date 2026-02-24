import { ROUTES } from "./constants";
import { RootStackParamList } from "./types";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Login from "@screens/Login";
import Register from "@screens/Register";
import { Dashboard } from "@screens/Dashboard";
import Onboarding from "@screens/Onboarding";
import Header from "@components/atoms/Header";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ForgotPassword from "@screens/ForgotPassword";
import Profile from "@screens/Profile";
import CreateNote from "@screens/CreateNote";
import ResetPassword from "@screens/ResetPassword";
import * as Linking from "expo-linking";
import EditProfile from "@screens/EditProfile";
import GuestConversion from "@screens/GuestConversion";
import DashboardHeader from "@components/atoms/DashboardHeader";
import DashboardLeftHeader from "@components/atoms/DashBoardLeftHeader";
import NotesPassword from "@screens/NotesPassword";
import ChangeNotePassword from "@screens/ChangeNotePassword";
import Notifications from "@screens/Notifications";

const Stack = createNativeStackNavigator<RootStackParamList>();
const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix, "notesapp://"],
  config: {
    screens: {
      ResetPassword: "reset-password",
      NotesPassword: "reset-notes-password",
    },
  },
};

const RootNavigator = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        {token == null ? (
          <Stack.Navigator initialRouteName="Onboarding">
            <Stack.Group
              screenOptions={{ header: (props) => <Header {...props} /> }}
            >
              <Stack.Screen
                name={ROUTES.ONBOARDING}
                component={Onboarding}
                options={{ headerShown: false }}
              />

              <Stack.Screen name={ROUTES.LOGIN} component={Login} />
              <Stack.Screen
                name={ROUTES.FORGOTPASSWORD}
                component={ForgotPassword}
              />

              <Stack.Screen
                name={ROUTES.RESETPASSWORD}
                component={ResetPassword}
              />
              <Stack.Screen
                name={ROUTES.EDITPROFILE}
                component={EditProfile}
                options={() => ({
                  title: "Edit Profile",
                })}
              />
              <Stack.Screen name={ROUTES.REGISTER} component={Register} />
            </Stack.Group>
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Group
              screenOptions={{ header: (props) => <Header {...props} /> }}
            >
              <Stack.Screen
                name={ROUTES.DASHBOARD}
                component={Dashboard}
                options={({ navigation }) => ({
                  headerLeft: () => <DashboardLeftHeader />,
                  headerRight: () => <DashboardHeader />,
                })}
              />

              <Stack.Screen
                name={ROUTES.PROFILE}
                component={Profile}
                options={() => ({
                  title: "Profile",
                })}
              />
              <Stack.Screen
                name={ROUTES.EDITPROFILE}
                component={EditProfile}
                options={() => ({
                  title: "Edit Profile",
                })}
              />
              <Stack.Screen
                name={ROUTES.RESETPASSWORD}
                component={ResetPassword}
              />
              <Stack.Screen name={ROUTES.CREATENOTE} component={CreateNote} />

              <Stack.Screen
                name={ROUTES.GUESTCONVERSION}
                component={GuestConversion}
              />
              <Stack.Screen
                name={ROUTES.NOTESPASSWORD}
                component={NotesPassword}
                options={() => ({
                  title: "Set Password",
                })}
              />
              <Stack.Screen
                name={ROUTES.CHANGENOTEPASSWORD}
                component={ChangeNotePassword}
                options={() => ({
                  title: "Change Notes Password",
                })}
              />
              <Stack.Screen
                name={ROUTES.NOTIFICATIONS}
                component={Notifications}
                options={() => ({
                  title: "Notifications",
                })}
              />
              <Stack.Screen
                name={ROUTES.FORGOTPASSWORD}
                component={ForgotPassword}
                // options={() => ({
                //   title: "Change Notes Password",
                // })}
              />
            </Stack.Group>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default RootNavigator;
