import CustomInput from "@components/atoms/CustomInput";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import {
  useGoogleMutation,
  useLoginMutation,
  usePushNotificationMutation,
} from "../../redux/api/authApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { login, google } from "@redux/slice/authSlice";
import { loginSchema } from "src/validations/loginSchema";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { AntDesign } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
import { useNetInfo } from "@react-native-community/netinfo";
import { text } from "drizzle-orm/gel-core";

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;
export default function Login({ navigation }: Readonly<LoginProps>) {
  const dispatch = useDispatch<AppDispatch>();
  const [loginapi, { isLoading }] = useLoginMutation();
  const [googleApi, { isLoading: isGoogleLoading }] = useGoogleMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      identifier: "",
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
    });
  }, []);
  const { isConnected } = useNetInfo();

  async function handleGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices();
      console.log(isConnected, "connection");
      if (!isConnected) {
        Toast.show({
          text1: "You appear to be offline. Please try again!",
        });
      }
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
      console.log("response", response);

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
      Toast.show({
        type: "success",
        text1: "Logged in with google",
      });

      requestUserPermission();
    } catch (error: any) {
      console.log("Google Sign-In Error:", error);
      const errorText = String(error);

      if (errorText.includes("NETWORK_ERROR")) {
        Toast.show({
          text1: "No internet connection",
          text2: "Please check your network",
        });
      } else {
        Toast.show({
          text1: "Google login failed",
        });
      }
    }
  }
  async function handleLogin(data: any) {
    try {
      const response = await loginapi({
        identifier: data.identifier,
        password: data.password,
      }).unwrap();
      console.log("dwefr", response.data);
      if (response.success) {
        dispatch(
          login({
            identifier: response.data.email,
            token: response.data.token,
            profileImageUrl: response.data.profileImageUrl,
            username: response.data.userName,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            isCommonPasswordSet: response.data.isCommonPasswordSet,
            isNotesUnlocked: response.data.isNotesUnlocked,
          }),
        );
        requestUserPermission();
      } else {
        Toast.show({
          text1: "Sign in failed",
        });
      }
    } catch (error: any) {
      console.log(error);
      if (error?.data?.message) {
        Toast.show({
          text1: error?.data?.message,
        });
      } else if (error.error.includes("TypeError: Network request failed")) {
        Toast.show({
          text1: "Connection lost. Please try again",
        });
      } else {
        Toast.show({
          text1: "Something went wrong. Please try again later.",
        });
      }
    }
  }
  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();
  return (
    <KeyboardAwareScrollView style={dynamicStyles.container}>
      <View style={dynamicStyles.innerContainer}>
        <Text style={dynamicStyles.heading}>Welcome Back</Text>
        <Text style={dynamicStyles.text}>Sign in to continue</Text>
      </View>
      <View style={dynamicStyles.inputContainer}>
        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
              text="Email / Username*"
              placeholder="Email or Username"
              color={Colors.placeholder}
              value={value.trim()}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.identifier && (
          <Text style={dynamicStyles.error}>{errors.identifier.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
              text="Password*"
              placeholder="Password"
              color={Colors.placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isPassword
            />
          )}
        />
        {errors.password && (
          <Text style={dynamicStyles.error}>{errors.password.message}</Text>
        )}
        <Pressable>
          <Text
            style={dynamicStyles.forgot}
            onPress={() => navigation.replace("ForgotPassword")}
          >
            Forgot Password?
          </Text>
        </Pressable>
      </View>
      <TouchableOpacity
        style={dynamicStyles.pressable}
        onPress={handleSubmit(handleLogin)}
      >
        <Text style={dynamicStyles.pressableText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
      <View style={dynamicStyles.lineContainer}>
        <View style={dynamicStyles.line} />
        <Text style={dynamicStyles.continueText}>or continue with</Text>
        <View style={dynamicStyles.line} />
      </View>
      <TouchableOpacity
        style={dynamicStyles.google}
        onPress={handleGoogleSignin}
      >
        <AntDesign name="google" size={20} color={Colors.textPrimary} />
        <Text style={dynamicStyles.googleText}>
          {isGoogleLoading ? "Sigining you in" : "Sign in with Google"}
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
