import CustomInput from "@components/atoms/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Toast from "react-native-toast-message";
import {
  useChangePasswordMutation,
  useResetPasswordMutation,
} from "@redux/api/authApi";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { resetPasswordSchema } from "src/validations/resetPasswordSchema";
import { changePasswordSchema } from "src/validations/changePasswordSchema";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import * as Linking from "expo-linking";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useStyles from "@hooks/useStyles";

type ResetPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "ResetPassword"
>;

type FormValues = {
  currentPassword?: string;
  password: string;
  confirmPassword: string;
};

export default function ChangePassword({
  navigation,
}: Readonly<ResetPasswordProps>) {
  const authToken = useSelector((state: RootState) => state.auth.token);
  // const [isVisible, setIsVisible] = useState(false);

  const schema = authToken ? changePasswordSchema : resetPasswordSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [resetApi, { isLoading: isResetLoading }] = useResetPasswordMutation();
  const [changeApi, { isLoading: isChangeLoading }] =
    useChangePasswordMutation();

  const url = Linking.useLinkingURL();
  const { dynamicStyles } = useStyles(styles);
  const resetToken = useMemo(() => {
    if (!url) return null;
    const parsed = Linking.parse(url);
    return parsed.queryParams?.token as string | null;
  }, [url]);

  useEffect(() => {
    if (url && !resetToken && !authToken) {
      Toast.show({ text1: "Reset link expired or invalid" });
    }
  }, [url, resetToken, authToken]);

  const onResetPassword = async (data: FormValues) => {
    try {
      if (!resetToken) {
        Toast.show({ text1: "Reset token expired or invalid" });
        return;
      }

      const response = await resetApi({
        newPassword: data.password,
        token: resetToken,
      }).unwrap();

      if (response.success) {
        Toast.show({ text1: "Password reset successful" });
        navigation.replace("Login");
      }
    } catch (error) {
      console.log(error);
      Toast.show({ text1: "Reset token expired or invalid" });
    }
  };

  const onChangePassword = async (data: FormValues) => {
    try {
      const response = await changeApi({
        currentPassword: data.currentPassword!,
        newPassword: data.password,
      }).unwrap();

      if (response.success) {
        Toast.show({ text1: "Password changed successfully" });
        navigation.replace("Login");
      }
    } catch (error: any) {
      console.log(error);
      if (error.data.message) {
        Toast.show({ text1: error.data.message });
      } else {
        Toast.show({ text1: "Something went wrong" });
      }
    }
  };
  navigation.setOptions({
    title: authToken ? "Change Password" : "Create New Password",
  });

  const onSubmit = authToken ? onChangePassword : onResetPassword;
  const isLoading = isResetLoading || isChangeLoading;

  return (
    <KeyboardAwareScrollView style={dynamicStyles.container}>
      {authToken && (
        <>
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onChange, value, onBlur } }) => (
              <CustomInput
                text="Current Password*"
                placeholder="Current Password"
                color="#707070ff"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                isPassword
                // isVisible={isVisible}
                // onToggleVisibility={() => setIsVisible((p) => !p)}
                // secureTextEntry={!isVisible}
              />
            )}
          />
          {errors.currentPassword && (
            <Text style={dynamicStyles.error}>
              {errors.currentPassword.message}
            </Text>
          )}
        </>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value, onBlur } }) => (
          <CustomInput
            text="Password*"
            placeholder="Password"
            value={value}
            color="#707070ff"
            onChangeText={onChange}
            onBlur={onBlur}
            isPassword
            // isVisible={isVisible}
            // onToggleVisibility={() => setIsVisible((p) => !p)}
            // secureTextEntry={!isVisible}
          />
        )}
      />
      {errors.password && (
        <Text style={dynamicStyles.error}>{errors.password.message}</Text>
      )}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value, onBlur } }) => (
          <CustomInput
            text="Confirm Password*"
            placeholder="Confirm Password"
            value={value}
            onChangeText={onChange}
            color="#707070ff"
            onBlur={onBlur}
            isPassword
            // isVisible={isVisible}
            // onToggleVisibility={() => setIsVisible((p) => !p)}
            // secureTextEntry={!isVisible}
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={dynamicStyles.error}>
          {errors.confirmPassword.message}
        </Text>
      )}

      <TouchableOpacity
        style={[dynamicStyles.pressable, isLoading && { opacity: 0.6 }]}
        disabled={isLoading}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={dynamicStyles.updateText}>
          {isLoading ? "Please wait..." : "Update Password"}
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
