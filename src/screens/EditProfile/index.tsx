import CustomInput from "@components/atoms/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppDispatch, RootState } from "@redux/store";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { EditSchema } from "src/validations/EditProfile";
import styles from "./style";
import { useEditUserMutation } from "@redux/api/authApi";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { edit } from "@redux/slice/authSlice";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";

type EditProfileProps = NativeStackScreenProps<
  RootStackParamList,
  "EditProfile"
>;
export default function EditProfile({
  navigation,
}: Readonly<EditProfileProps>) {
  const username = useSelector((state: RootState) => state.auth.username);
  console.log(username, "userbaneysbrhj");
  const firstName = useSelector((state: RootState) => state.auth.firstName);
  const lastName = useSelector((state: RootState) => state.auth.lastName);
  const [editApi, { isLoading }] = useEditUserMutation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditSchema),
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      username: username ?? "",
    },
  });
  async function handle(data: any) {
    try {
      const response = await editApi({
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.username,
      }).unwrap();

      console.log(response);
      if (response.success) {
        dispatch(
          edit({
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
          }),
        );
        Toast.show({
          text1: "Profile updated successfully!",
          type: "success",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
        if (navigation.canGoBack()) navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      if (error?.data?.message) {
        Toast.show({
          text1: error?.data?.message,
          type: "error",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
      } else {
        Toast.show({
          text1: "Profile updation failed",
          type: "error",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
      }
    }
  }
  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();
  return (
    <KeyboardAwareScrollView style={dynamicStyles.container}>
      <Text style={dynamicStyles.text}>Update your profile details</Text>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            text="First Name"
            placeholder={firstName ?? undefined}
            color={Colors.placeholder}
            value={value?.trim()}
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
            text="Last Name"
            placeholder={lastName ?? undefined}
            color={Colors.placeholder}
            value={value?.trim()}
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
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            text="Username"
            placeholder={username ?? undefined}
            color={Colors.placeholder}
            value={value?.trim()}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.username?.message && (
        <Text style={dynamicStyles.error}>{errors.username.message}</Text>
      )}

      <TouchableOpacity
        style={dynamicStyles.pressable}
        onPress={handleSubmit(handle)}
      >
        <Text style={dynamicStyles.pressableText}>
          {isLoading ? "Updating Profile..." : "Update Profile"}
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
