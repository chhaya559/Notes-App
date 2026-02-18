import CustomInput from "@components/atoms/CustomInput";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import {
  useGoogleMutation,
  usePushNotificationMutation,
  useRegisterMutation,
} from "@redux/api/authApi";
import { useDispatch } from "react-redux";
import { register, google } from "@redux/slice/authSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "src/validations/registerSchema";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { AntDesign } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";
type RegisterProps = NativeStackScreenProps<RootStackParamList, "Register">;
export default function Register({ navigation }: Readonly<RegisterProps>) {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [registerApi, { isLoading }] = useRegisterMutation();
  const [googleApi, { isLoading: isGoogleLoading }] = useGoogleMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),

    defaultValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });
  const [pushApi] = usePushNotificationMutation();

  async function handleTokenSend(token: string) {
    try {
      const response = await pushApi({
        token: token,
        platform: Platform.OS,
      }).unwrap();

      console.log(Platform.OS, "fhrufhir");
      console.log("Device token send response", response);
    } catch (err) {
      console.log("Error sending device token", err);
    }
  }

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    const token = await messaging().getToken();
    console.log(token, "FCM token");

    if (enabled) {
      handleTokenSend(token);
      console.log("Authorization status:", authStatus);
    }
  }

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }, []);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  navigation.setOptions({
    title: "Create Account",
  });
  async function handleGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (!isSuccessResponse(userInfo)) {
        Alert.alert("Google Sign-In failed");
        return;
      }

      const idToken = userInfo.data.idToken;

      if (!idToken) {
        Alert.alert("Error", "No ID token found from Googe");
        return;
      }

      const response = await googleApi({ idToken }).unwrap();

      dispatch(
        google({
          token: response.data.token,
          email: userInfo.data.user.email,
          firstName: userInfo.data.user.name,
          profileImageUrl: userInfo.data.user.photo,
          isCommonPasswordSet: response.data.isCommonPasswordSet,
          isNotesUnlocked: response.data.isNotesUnlocked,
        }),
      );
      navigation.navigate("EditProfile");
      Toast.show({
        type: "success",
        text1: "Logged in with gogle",
      });
      requestUserPermission();
    } catch (error: any) {
      console.log("Google Sign-In Error:", error);
      Toast.show({
        text1: "Google login failed",
      });
    }
  }
  async function handleSignup(data: any) {
    try {
      const response = await registerApi({
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.username,
        email: data.email,
        password: data.password,
      }).unwrap();
      console.log(response, "ffgufgr");
      if (response.success) {
        dispatch(
          register({
            token: response.data.token,
            email: response.data.email,
            profileImageUrl: response.data.profileImageUrl,
            username: response.data.userName,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            isCommonPasswordSet: response.data.isCommonPasswordSet,
            isNotesUnlocked: response.data.isNotesUnlocked,
          }),
        );
        requestUserPermission();
      } else {
        Alert.alert("Signup failed", response.message);
        console.log(response, "dweugjdl");
      }
    } catch (error: any) {
      if (error.data.message) {
        Toast.show({
          text1: error.data.message,
        });
      } else {
        Toast.show({
          text1: "Something went wrong",
        });
      }
    }
  }

  return (
    <KeyboardAwareScrollView style={[styles.container]}>
      {/* <ScrollView contentContainerStyle={styles.container} scrollEnabled={true}> */}
      {/* <View style={styles.innerContainer}> */}
      <Text style={styles.text}>Join NoteSmart today</Text>
      {/* </View> */}
      <View>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
              text="Username*"
              placeholder="Username"
              color="#707070ff"
              value={value.trim()}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.username && (
          <Text style={styles.error}>{errors.username.message}</Text>
        )}
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
              text="First Name*"
              placeholder="First Name"
              color="#707070ff"
              value={value.trim()}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.firstName && (
          <Text style={styles.error}>{errors.firstName.message}</Text>
        )}
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
              text="Last Name*"
              placeholder="Last Name"
              color="#707070ff"
              value={value.trim()}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.lastName && (
          <Text style={styles.error}>{errors.lastName.message}</Text>
        )}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
              text="Email*"
              placeholder="Email"
              color="#707070ff"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
              text="Password*"
              placeholder="Password"
              color="#707070ff"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isPassword
              isVisible={isVisible}
              onToggleVisibility={() => {
                setIsVisible((prev) => !prev);
              }}
              secureTextEntry={!isVisible}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.pressable}
        onPress={handleSubmit(handleSignup)}
      >
        <Text style={styles.pressableText}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Text>
      </TouchableOpacity>

      <View>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <Text style={styles.continueText}>or continue with</Text>
          <View style={styles.line} />
        </View>
        <TouchableOpacity style={styles.google} onPress={handleGoogleSignin}>
          <AntDesign name="google" size={20} color="black" />
          <Text style={styles.googleText}>
            {isGoogleLoading ? "Signing up..." : "Sign up with Google"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* </ScrollView> */}
    </KeyboardAwareScrollView>
  );
}
