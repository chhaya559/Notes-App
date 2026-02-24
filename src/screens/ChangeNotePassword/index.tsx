import CustomInput from "@components/atoms/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "src/navigation/types";
import styles from "../NotesPassword/styles";
import { changeNotePasswordSchema } from "src/validations/ChangeNotePassword";
import { useChangePasswordMutation } from "@redux/api/noteApi";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";

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

  const { dynamicStyles } = useStyles(styles);
  async function handle(data: any) {
    try {
      const response = await changeApi({
        oldPassword: data.currentPassword,
        newPassword: data.password,
      }).unwrap();

      if (response.success) {
        Toast.show({ text1: "Password Changed successfully!" });
        navigation.goBack();
      }
    } catch (error: any) {
      if (error?.data?.message) {
        Toast.show({
          text1: error?.data?.message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to change password",
        });
      }
      console.log(error.data.message);
    }
  }
  const { Colors } = useTheme();
  return (
    <KeyboardAwareScrollView style={dynamicStyles.container}>
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
            color={Colors.placeholder}
          />
        )}
      />
      {errors.currentPassword && (
        <Text style={dynamicStyles.error}>
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
            color={Colors.placeholder}
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
            onBlur={onBlur}
            isPassword
            color={Colors.placeholder}
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={dynamicStyles.error}>
          {errors.confirmPassword.message}
        </Text>
      )}

      <TouchableOpacity
        disabled={isLoading}
        onPress={handleSubmit(handle)}
        style={dynamicStyles.pressable}
      >
        <Text style={dynamicStyles.pressableText}>
          {isLoading ? "Updating password..." : "Update password"}
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
