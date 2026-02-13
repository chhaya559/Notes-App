import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { useDispatch } from "react-redux";
import { guest } from "@redux/slice/authSlice";
import { useGuestMutation } from "@redux/api/authApi";
import { AppDispatch } from "@redux/store";
type OnboardingProps = NativeStackScreenProps<RootStackParamList, "Onboarding">;
export default function Onboarding({ navigation }: Readonly<OnboardingProps>) {
  const dispatch = useDispatch<AppDispatch>();
  const [guestApi, { isLoading }] = useGuestMutation();
  async function handleGuestLogin() {
    const response = await guestApi().unwrap();
    console.log(response);
    dispatch(
      guest({
        token: response.data.token,
        profileImageUrl: response.data.profileImageUrl,
      }),
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Image
          source={require("../../../assets/notes.png")}
          style={styles.image}
        />
        <Text style={styles.name}>NoteSmart</Text>
        <Text style={styles.text}>Your intelligent note-taking companion</Text>
        <Text style={styles.ai}>AI - Powered summaries</Text>
      </View>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          style={styles.signin}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.signinText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.create}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.createText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.guest}
          onPress={() => handleGuestLogin()}
        >
          <Text style={styles.guestText}>
            {isLoading ? "Signing in as Guest.." : "Continue as Guest"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Secure . Offline Support . Smart Reminders
      </Text>
    </View>
  );
}
