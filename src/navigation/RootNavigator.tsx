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
import { Image, Text, TouchableOpacity, View } from "react-native";
import DashboardHeader from "@components/atoms/DashboardHeader";
import { Entypo } from "@expo/vector-icons";
import Save from "@components/atoms/Save";

const Stack = createNativeStackNavigator<RootStackParamList>();
const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix, "notesapp://"],
  config: {
    screens: {
      ResetPassword: "reset-password",
    },
  },
};

const RootNavigator = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const user = useSelector((state: RootState) => state.auth.firstName);
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        {token == null ? (
          <Stack.Navigator>
            <Stack.Group
              screenOptions={{ header: (props) => <Header {...props} /> }}
            >
              <Stack.Screen name={ROUTES.ONBOARDING} component={Onboarding} />
              <Stack.Screen name={ROUTES.LOGIN} component={Login} />
              <Stack.Screen
                name={ROUTES.FORGOTPASSWORD}
                component={ForgotPassword}
              />
              <Stack.Screen
                name={ROUTES.RESETPASSWORD}
                component={ResetPassword}
              />

              <Stack.Screen name={ROUTES.REGISTER} component={Register} />
            </Stack.Group>
          </Stack.Navigator>
        ) : (
          <Stack.Navigator initialRouteName="Dashboard">
            <Stack.Group
              screenOptions={{ header: (props) => <Header {...props} /> }}
            >
              <Stack.Screen
                name={ROUTES.DASHBOARD}
                component={Dashboard}
                options={({ navigation }) => ({
                  headerLeft: () => (
                    <>
                      <View
                        style={{
                          height: 45,
                          width: 45,
                          backgroundColor: "#615FFF",
                          borderRadius: 50,
                          position: "relative",
                        }}
                      >
                        <Image
                          source={require("../../assets/notes.png")}
                          style={{
                            height: 35,
                            width: 35,
                            borderRadius: 20,
                            position: "absolute",
                            left: 5,
                            top: 5,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 18,
                          color: "#5757f8",
                          fontWeight: "600",
                          alignSelf: "center",
                        }}
                      >
                        {user == null || undefined ? "Guest" : { user }}'s Notes
                      </Text>
                    </>
                  ),
                  headerRight: () => <DashboardHeader />,
                })}
              />

              <Stack.Screen name={ROUTES.PROFILE} component={Profile} />
              <Stack.Screen
                name={ROUTES.RESETPASSWORD}
                component={ResetPassword}
              />
              <Stack.Screen name={ROUTES.CREATENOTE} component={CreateNote} />
              <Stack.Screen name={ROUTES.EDITPROFILE} component={EditProfile} />
              <Stack.Screen
                name={ROUTES.GUESTCONVERSION}
                component={GuestConversion}
              />
            </Stack.Group>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default RootNavigator;
