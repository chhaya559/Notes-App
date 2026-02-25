import CustomInput from "@components/atoms/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useGuestConversionMutation,
  usePushNotificationMutation,
} from "@redux/api/authApi";
import { conversion, isGuest } from "@redux/slice/authSlice";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  PermissionsAndroid,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { registerSchema } from "src/validations/registerSchema";
import style from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import messaging from "@react-native-firebase/messaging";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";

type ConversionProps = NativeStackScreenProps<
  RootStackParamList,
  "GuestConversion"
>;
export default function GuestConversion({
  navigation,
}: Readonly<ConversionProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: "",
      username: "",
      lastName: "",
      email: "",
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
  const dispatch = useDispatch();
  const [conversionApi] = useGuestConversionMutation();

  async function handleConversion(data: any) {
    try {
      console.log(data, "ftyjf");
      const response = await conversionApi({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        username: data.username,
      }).unwrap();

      if (response.success) {
        dispatch(
          conversion({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            username: response.data.userName,
            email: response.data.email,
            isGuest: false,
          }),
        );
        dispatch(
          isGuest({
            isGuest: false,
          }),
        );
        Toast.show({
          text1: "Guest converted to User",
        });
        requestUserPermission();
        navigation.navigate("Dashboard");
      }
    } catch (error: any) {
      console.log(error);
      if (error?.data?.message) {
        Toast.show({
          text1: error?.data?.message,
        });
      } else {
        Toast.show({
          text1: "Error converting guest to user",
        });
      }
    }
  }
  const { dynamicStyles } = useStyles(style);
  const { Colors } = useTheme();
  return (
    <KeyboardAwareScrollView style={{ backgroundColor: Colors.background }}>
      <View style={dynamicStyles.container}>
        <Text style={dynamicStyles.heading}>Convert Guest to User</Text>
        <Text style={dynamicStyles.text}>Sign up to save your notes</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              text="Username*"
              placeholder="Username"
              color={Colors.placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        {errors.username?.message && (
          <Text style={dynamicStyles.error}>{errors.username.message}</Text>
        )}
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              text="First Name*"
              placeholder="First Name"
              color={Colors.placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.firstName?.message && (
          <Text style={dynamicStyles.error}>{errors.firstName.message}</Text>
        )}
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              text="Last Name*"
              placeholder="Last Name"
              color={Colors.placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.lastName?.message && (
          <Text style={dynamicStyles.error}>{errors.lastName.message}</Text>
        )}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              text="Email*"
              placeholder="Email"
              color={Colors.placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.email?.message && (
          <Text style={dynamicStyles.error}>{errors.email.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
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
        {errors.password?.message && (
          <Text style={dynamicStyles.error}>{errors.password.message}</Text>
        )}
        <Pressable
          onPress={handleSubmit(handleConversion)}
          style={dynamicStyles.pressable}
        >
          <Text style={dynamicStyles.pressableText}>Convert to User</Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}
