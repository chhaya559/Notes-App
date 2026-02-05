import CustomInput from "@components/atoms/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import style from "@screens/GuestConversion/styles";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "src/navigation/types";
import { NotesSchema } from "src/validations/NotesPassword";
import styles from "./styles";
import { useNoteLockMutation } from "@redux/api/noteApi";

type NotesPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "NotesPassword"
>;
export default function NotesPassword({
  navigation,
  route,
}: Readonly<NotesPasswordProps>) {
  const [LockNote, { isLoading }] = useNoteLockMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(NotesSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const noteID = route?.params?.id;
  async function handle(data: any) {
    try {
      console.log(data.password, "gfy");
      const response = await LockNote({
        id: noteID,
        isPasswordProtected: true,
        password: data.password,
      }).unwrap();

      if (response.success) {
        Toast.show({ text1: "Password set successfully!" });
        navigation.goBack();
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to set password",
      });
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "500", textAlign: "center" }}>
        Set Password
      </Text>

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
          {isLoading ? "Saving..." : "Set password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
