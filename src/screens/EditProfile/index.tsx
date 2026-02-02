import CustomInput from "@components/atoms/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppDispatch, RootState } from "@redux/store";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { EditSchema } from "src/validations/EditProfile";
import styles from "./style";
import { useEditUserMutation } from "@redux/api/authApi";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { edit } from "@redux/slice/authSlice";

type EditProfileProps = NativeStackScreenProps<
  RootStackParamList,
  "EditProfile"
>;
export default function EditProfile({ navigation }: EditProfileProps) {
  const username = useSelector((state: RootState) => state.auth.username);
  const firstName = useSelector((state: RootState) => state.auth.firstName);
  const lastName = useSelector((state: RootState) => state.auth.lastName);
  const [editApi] = useEditUserMutation();
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
        });
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      if (error?.data?.message.includes("Username is already taken")) {
        Toast.show({
          text1: "Username is already taken",
        });
      } else {
        Toast.show({
          text1: "Profile updation failed",
        });
      }
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>
      <Text style={styles.text}>Update your profile details</Text>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            text="First Name"
            placeholder={firstName ?? undefined}
            color="#707070ff"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.firstName?.message && (
        <Text style={styles.error}>{errors.firstName.message}</Text>
      )}
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            text="Last Name"
            placeholder={lastName ?? undefined}
            color="#707070ff"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.lastName?.message && (
        <Text style={styles.error}>{errors.lastName.message}</Text>
      )}
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            text="Username"
            placeholder={username ?? undefined}
            color="#707070ff"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.username?.message && (
        <Text style={styles.error}>{errors.username.message}</Text>
      )}

      <TouchableOpacity style={styles.pressable} onPress={handleSubmit(handle)}>
        <Text style={styles.pressableText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
