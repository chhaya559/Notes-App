import CustomInput from "@components/atoms/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEditUserMutation, useGetUserQuery } from "@redux/api/authApi";
import style from "@screens/GuestConversion/styles";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "src/navigation/types";
import { NotesSchema } from "src/validations/NotesPassword";
import styles from "../NotesPassword/styles";
import { changeNotePasswordSchema } from "src/validations/ChangeNotePassword";
import { useChangePasswordMutation } from "@redux/api/noteApi";

type ChangeNotesPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "ChangeNotePassword"
>;
export default function ChangeNotePassword({
  navigation,
}: Readonly<ChangeNotesPasswordProps>) {
  const [changeApi, { isLoading }] = useChangePasswordMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changeNotePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  async function handle(data: any) {
    try {
      console.log(data.password, "gfy");
      const response = await changeApi({
        oldPassword: data.currentPassword,
        newPassword: data.password,
      }).unwrap();

      if (response.success) {
        Toast.show({ text1: "Password Changed successfully!" });
        navigation.goBack();
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to change password",
      });
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "500", textAlign: "center" }}>
        Change Password
      </Text>
      <Controller
        control={control}
        name="currentPassword"
        render={({ field: { onChange, value, onBlur } }) => (
          <CustomInput
            text=" Current Password*"
            placeholder="Current Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            isPassword
            isVisible={isPasswordVisible}
            onToggleVisibility={() => setIsPasswordVisible((p) => !p)}
            secureTextEntry={!isPasswordVisible}
          />
        )}
      />
      {errors.currentPassword && (
        <Text style={{ color: "red", marginLeft: 15 }}>
          {errors.currentPassword.message}
        </Text>
      )}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value, onBlur } }) => (
          <CustomInput
            text="Password*"
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            isPassword
            isVisible={isPasswordVisible}
            onToggleVisibility={() => setIsPasswordVisible((p) => !p)}
            secureTextEntry={!isPasswordVisible}
          />
        )}
      />
      {errors.password && (
        <Text style={{ color: "red", marginLeft: 15 }}>
          {errors.password.message}
        </Text>
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
            onBlur={onBlur}
            isPassword
            isVisible={isConfirmVisible}
            onToggleVisibility={() => setIsConfirmVisible((p) => !p)}
            secureTextEntry={!isConfirmVisible}
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={{ color: "red", marginLeft: 15 }}>
          {errors.confirmPassword.message}
        </Text>
      )}

      <TouchableOpacity
        disabled={isLoading}
        onPress={handleSubmit(handle)}
        style={styles.pressable}
      >
        <Text style={styles.pressableText}>
          {isLoading ? "Changing password..." : "Change password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
