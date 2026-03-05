import CustomInput from "@components/atoms/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "src/navigation/types";
import { NotesSchema } from "src/validations/NotesPassword";
import styles from "./styles";
import { useNoteLockMutation } from "@redux/api/noteApi";
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
  const [resetNotesApi, { isLoading }] = useResetNotesPasswordMutation();
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

    try {
      const parsed = Linking.parse(url);
      return parsed?.queryParams?.token
        ? String(parsed.queryParams.token)
        : null;
    } catch (err) {
      console.log("Token parsing error:", err);
      return null;
    }
  }, [url]);

  console.log("Deep link URL:", url);
  console.log("Reset Token:", resetToken);
  const dispatch = useDispatch();
  useEffect(() => {
    if (url && !resetToken) {
      Toast.show({
        type: "error",
        text1: "Reset link expired or invalid",
      });
    }
  }, [url, resetToken]);
  const noteID = route?.params?.noteID;

  // async function handle(data: any) {
  //   try {
  //     if (hasCommonPassword) {
  //       if (!resetToken) {
  //         Toast.show({
  //           type: "error",
  //           text1: "Invalid reset link",
  //         });
  //         return;
  //       }
  //       const response = await resetNotesApi({
  //         newNotesPassword: data.password,
  //         token: resetToken,
  //       }).unwrap();
  //       if (response.success) {
  //         Toast.show({
  //           text1: "Password set successfully!",
  //           type: "success",
  //           swipeable: false,
  //           onPress: () => Toast.hide(),
  //         });
  //         navigation.goBack();
  //       }
  //     } else {
  //       console.log(noteID, data.password, "freugfherikg");
  //       const response = await lockApi({
  //         id: noteID,
  //         isPasswordProtected: true,
  //         password: data.password,
  //       }).unwrap();

  //       console.log(response, "response from lock api");
  //       if (response.success) {
  //         dispatch(setCommonPasswordSet(true));
  //         await db
  //           .update(notesTable)
  //           .set({
  //             isPasswordProtected: 1,
  //             updatedAt: new Date().toISOString(),
  //           })
  //           .where(eq(notesTable.id, noteID));
  //         Toast.show({
  //           text1: "Password set successfully!",
  //           type: "success",
  //           swipeable: false,
  //           onPress: () => Toast.hide(),
  //         });
  //         navigation.goBack();
  //       }
  //     }
  //   } catch (error: any) {
  //     if (error?.data?.message) {
  //       Toast.show({
  //         text1: error?.data?.message,
  //         type: "error",
  //         swipeable: false,
  //         onPress: () => Toast.hide(),
  //       });
  //     } else
  //       Toast.show({
  //         type: "error",
  //         text1: "Failed to set password",
  //         swipeable: false,
  //         onPress: () => Toast.hide(),
  //       });
  //     console.log(error, "gsghrth");
  //   }
  // }
  async function handle(data: any) {
    try {
      /**
       * CASE 1
       * Reset notes password using deep link token
       */
      if (hasCommonPassword) {
        if (!resetToken) {
          Toast.show({
            type: "error",
            text1: "Invalid reset link",
          });
          return;
        }

        const response = await resetNotesApi({
          newNotesPassword: data.password,
          token: resetToken,
        }).unwrap();

        if (response?.success) {
          Toast.show({
            text1: "Password set successfully!",
            type: "success",
            swipeable: false,
            onPress: () => Toast.hide(),
          });

          navigation.goBack();
        }
      } else {
        /**
         * CASE 2
         * First time setting notes password
         */
        console.log("Setting notes password:", noteID, data.password);

        const response = await lockApi({
          id: noteID,
          isPasswordProtected: true,
          password: data.password,
        }).unwrap();

        console.log("Lock API response:", response);

        if (response?.success) {
          dispatch(setCommonPasswordSet(true));

          await db
            .update(notesTable)
            .set({
              isPasswordProtected: 1,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(notesTable.id, noteID));

          Toast.show({
            text1: "Password set successfully!",
            type: "success",
            swipeable: false,
            onPress: () => Toast.hide(),
          });

          navigation.goBack();
        }
      }
    } catch (error: any) {
      console.log("Notes password error:", error);

      if (error?.data?.message) {
        Toast.show({
          text1: error.data.message,
          type: "error",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to set password",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
      }
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
