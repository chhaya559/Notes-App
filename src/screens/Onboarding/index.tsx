import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { useDispatch } from "react-redux";
import { guest } from "@redux/slice/authSlice";
import { useGuestMutation } from "@redux/api/authApi";
import { AppDispatch } from "@redux/store";
import useStyles from "@hooks/useStyles";
import { useNetInfo } from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
type OnboardingProps = NativeStackScreenProps<RootStackParamList, "Onboarding">;
export default function Onboarding({ navigation }: Readonly<OnboardingProps>) {
  const dispatch = useDispatch<AppDispatch>();
  const [guestApi, { isLoading }] = useGuestMutation();
  const { isConnected } = useNetInfo();
  const { dynamicStyles } = useStyles(styles);

  // --------------------- guest login --------------
  async function handleGuestLogin() {
    if (!isConnected) {
      Toast.show({
        text1: "Connection error",
        text2: "Please check your internet",
        type: "info",
        swipeable: false,
        onPress: () => Toast.hide(),
      });
    }
    const response = await guestApi().unwrap();
    console.log(response, "ihergihtr;o");
    dispatch(
      guest({
        token: response.data.token,
        profileImageUrl: response.data.profileImageUrl,
      }),
    );
  }

  return (
    <View style={dynamicStyles.outerContainer}>
      <View style={dynamicStyles.container}>
        <Image
          source={require("../../../assets/logo.png")}
          style={dynamicStyles.image}
        />
        <Text style={dynamicStyles.name}>NoteSmart</Text>
        <Text style={dynamicStyles.text}>
          Your intelligent note-taking companion
        </Text>
        <Text style={dynamicStyles.ai}>AI - Powered summaries</Text>
      </View>
      <View style={dynamicStyles.innerContainer}>
        {/* ---------------------------------------- login ---------------------------------------- */}
        <TouchableOpacity
          style={dynamicStyles.signin}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={dynamicStyles.signinText}>Sign In</Text>
        </TouchableOpacity>
        {/* ---------------------------------------- register ---------------------------------------- */}
        <TouchableOpacity
          style={dynamicStyles.create}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={dynamicStyles.createText}>Create Account</Text>
        </TouchableOpacity>
        {/* ---------------------------------------- guest ---------------------------------------- */}
        <TouchableOpacity
          style={[dynamicStyles.guest]}
          onPress={() => handleGuestLogin()}
        >
          <Text style={dynamicStyles.guestText}>
            {isLoading ? "Signing in as Guest.." : "Continue as Guest"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={dynamicStyles.footer}>
        Secure . Offline Support . Smart Reminders
      </Text>
    </View>
  );
}
