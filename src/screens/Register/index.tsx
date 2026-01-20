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
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { useGoogleMutation, useRegisterMutation } from "@redux/api/authApi";
import { useDispatch } from "react-redux";
import { register, google } from "@redux/slice/authSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "src/validations/registerSchema";
import { MaterialIcons } from "@expo/vector-icons";

type RegisterProps = NativeStackScreenProps<RootStackParamList, "Register">;
export default function Register({ navigation }: RegisterProps) {
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
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }, []);
  // async function handleGoogleSignin() {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     if (!isSuccessResponse(userInfo)) {
  //       Alert.alert("Google Sign-In failed");
  //       return;
  //     }
  //     const idToken = userInfo.data.idToken;

  //     if (!idToken) {
  //       Alert.alert("Error", "No ID token found from Googe");
  //       return;
  //     }

  //     const response = await googleApi({ idToken });
  //     console.log("Response", response);
  //     if (response?.data?.Token) {
  //       dispatch(
  //         google({
  //           IdToken: response.data.Token,
  //         }),
  //       );
  //       Alert.alert("Success", "Logged in with google");
  //     } else {
  //       Alert.alert("Error");
  //     }
  //   } catch (error: any) {
  //     console.log("Google Sign-In Error:", error);
  //     Alert.alert("Google login failed", error.message);
  //   }
  // }
  async function handleGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo?.data?.idToken;
      console.log("idtoekn", idToken);
      if (!idToken) {
        Alert.alert("Error", "No Google ID token received");
        return;
      }

      const response = await googleApi({ idToken });
      console.log("Response", response);
      if (!response.data.success) {
        Alert.alert("Google login failed");
        return;
      }
      const jwtToken = response.data.data.token;

      dispatch(
        google({
          token: jwtToken,
        }),
      );

      Alert.alert("Success", "Logged in with Google");
    } catch (error: any) {
      console.log("Google Sign-In Error:", error);
      Alert.alert("Google login failed", error.message);
    }
  }
  async function handleSignup(data: any) {
    try {
      const response = await registerApi(data).unwrap();
      console.log(response);
      if (response.success) {
        dispatch(
          register({
            token: response.data.token,
            email: response.data.email,
          }),
        );
      } else {
        Alert.alert("Signup failed", response.message);
      }
    } catch (error: any) {
      if (error.data.Errors.includes("Email already exists")) {
        Alert.alert("Email already exists");
      }
      if (error.data.Errors.includes("Username already exists")) {
        Alert.alert("Username already exists");
      } else {
        Alert.alert("Something went wrong");
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={true}>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.text}>Join NoteSmart today</Text>
      </View>
      <View>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
              text="Username"
              placeholder="Username"
              color="#707070ff"
              value={value}
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
              text="First Name"
              placeholder="First Name"
              color="#707070ff"
              value={value}
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
              text="Last Name"
              placeholder="Last Name"
              color="#707070ff"
              value={value}
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
              text="Email"
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
              text="Password"
              placeholder="Email or password"
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
      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <Text style={styles.continueText}>or continue with</Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity style={styles.google} onPress={handleGoogleSignin}>
        <Text style={styles.googleText}>
          {isGoogleLoading ? "Signing up..." : "Sign up with Google"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
