import CustomInput from "@components/atoms/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import style from "@screens/GuestConversion/styles";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "src/navigation/types";
import { NotesSchema } from "src/validations/NotesPassword";
import styles from "./styles";
import {
  useNoteLockMutation,
  useSearchNotesQuery,
  useUpdateMutation,
} from "@redux/api/noteApi";
import { useDispatch, useSelector } from "react-redux";
import { setCommonPasswordSet } from "@redux/slice/authSlice";
import { db } from "src/db/notes";
import { notesTable } from "src/db/schema";
import { eq } from "drizzle-orm";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import * as Linking from "expo-linking";
import { useResetNotesPasswordMutation } from "@redux/api/authApi";
import { RootState } from "@redux/store";
import useStyles from "@hooks/useStyles";

type NotesPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "NotesPassword"
>;
export default function NotesPassword({
  navigation,
  route,
}: Readonly<NotesPasswordProps>) {
  const [updateNote, { isLoading }] = useUpdateMutation();
  const [resetNotesApi] = useResetNotesPasswordMutation();
  const [lockApi] = useNoteLockMutation();
  const hasCommonPassword = useSelector(
    (state: RootState) => state.auth.isCommonPasswordSet,
  );
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
  const url = Linking.useLinkingURL();

  const resetToken = useMemo(() => {
    if (!url) return null;
    const parsed = Linking.parse(url);
    return parsed.queryParams?.token as string | null;
  }, [url]);
  const dispatch = useDispatch();

  const noteID = route?.params?.noteID;
  const title = route?.params?.title ?? "";
  const content = route?.params?.content ?? "";

  async function handle(data: any) {
    try {
      if (hasCommonPassword) {
        const response = await resetNotesApi({
          newNotesPassword: data.password,
          token: resetToken,
        }).unwrap();
        if (response.success) {
          Toast.show({ text1: "Password set successfully!" });
          navigation.goBack();
        }
      } else {
        console.log(noteID, data.password, "freugfherikg");
        const response = await lockApi({
          id: noteID,
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
  const { dynamicStyles } = useStyles(styles);
  return (
    <KeyboardAwareScrollView style={dynamicStyles.container}>
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
            color="#707070ff"
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
          {isLoading ? "Saving..." : "Set password"}
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
