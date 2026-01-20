import CustomInput from "@components/atoms/CustomInput";
import {
  Alert,
  Pressable,
  ScrollView,
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
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { useGoogleMutation, useLoginMutation } from "../../redux/api/authApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { login, google } from "@redux/slice/authSlice";
import { loginSchema } from "src/validations/loginSchema";
import { MaterialIcons } from "@expo/vector-icons";
type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;
export default function Login({ navigation }: LoginProps) {
  const [isVisible, setIsVisible] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const [loginapi, { isLoading, error }] = useLoginMutation();
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

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }, []);
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
        }),
      );
      Alert.alert("Success", "Logged in with google");
    } catch (error: any) {
      console.log("Google Sign-In Error:", error);
      Alert.alert("Google login failed", error.message);
    }
  }
  async function handleLogin(data: any) {
    try {
      const response = await loginapi({
        identifier: data.identifier,
        password: data.password,
      }).unwrap();
      if (response.success) {
        dispatch(
          login({
            identifier: response.data.email,
            token: response.data.token,
          }),
        );
      } else {
        Alert.alert("Sign in failed", response.message);
      }
    } catch (error: any) {
      const errorMessage = error || "Something went wrong";
      Alert.alert("error", errorMessage);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={true}>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.text}>Sign in to continue</Text>
      </View>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
              text="Email / Username"
              placeholder="Email or Username"
              color="#707070ff"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.identifier && (
          <Text style={styles.error}>{errors.identifier.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
              text="Password"
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
        <Pressable>
          <Text
            style={styles.forgot}
            onPress={() => navigation.replace("ForgotPassword")}
          >
            Forgot Password?
          </Text>
        </Pressable>
      </View>
      <TouchableOpacity
        style={styles.pressable}
        onPress={handleSubmit(handleLogin)}
      >
        <Text style={styles.pressableText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <Text style={styles.continueText}>or continue with</Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity style={styles.google} onPress={handleGoogleSignin}>
        <Text style={styles.googleText}>
          {isGoogleLoading ? "Sigining you in" : "Sign in with Google"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
