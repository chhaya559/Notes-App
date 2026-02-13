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
import { useUpdateMutation } from "@redux/api/noteApi";
import { useDispatch } from "react-redux";
import { setCommonPasswordSet } from "@redux/slice/authSlice";
import { db } from "src/db/notes";
import { notesTable } from "src/db/schema";
import { eq } from "drizzle-orm";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

type NotesPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "NotesPassword"
>;
export default function NotesPassword({
  navigation,
  route,
}: Readonly<NotesPasswordProps>) {
  const [updateNote, { isLoading }] = useUpdateMutation();
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

  const dispatch = useDispatch();
  // const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const noteID = route?.params?.id;
  const title = route?.params?.title ?? "";
  const content = route?.params?.content ?? "";

  async function handle(data: any) {
    try {
      const response = await updateNote({
        id: noteID,
        title,
        content,
        isPasswordProtected: true,
        password: data.password,
      }).unwrap();

      console.log(response, "response from lock api");
      if (response.success) {
        dispatch(setCommonPasswordSet(true));
        await db
          .update(notesTable)
          .set({
            isPasswordProtected: 1,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(notesTable.id, noteID));
        Toast.show({ text1: "Password set successfully!" });
        navigation.goBack();
      }
    } catch (error: any) {
      if (error?.data?.message) {
        Toast.show({
          text1: error?.data?.message,
        });
      } else
        Toast.show({
          type: "error",
          text1: "Failed to set password",
        });
      console.log(error);
    }
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
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
            color="#707070ff"
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
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
            color="#707070ff"
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
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
    </KeyboardAwareScrollView>
  );
}
