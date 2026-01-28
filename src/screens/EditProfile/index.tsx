import CustomInput from "@components/atoms/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { RootState } from "@redux/store";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { EditSchema } from "src/validations/EditProfile";
import styles from "./style";
import { useEditUserMutation } from "@redux/api/authApi";
import Toast from "react-native-toast-message";

export default function EditProfile() {
  const username = useSelector((state: RootState) => state.auth.username);
  const firstName = useSelector((state: RootState) => state.auth.firstName);
  const lastName = useSelector((state: RootState) => state.auth.lastName);
  const [editApi] = useEditUserMutation();

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
        Toast.show({
          text1: "Profile updated successfully!",
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Profile updation failed",
      });
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
      {errors.firstName?.message && <Text>{errors.firstName.message}</Text>}
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
      {errors.lastName?.message && <Text>{errors.lastName.message}</Text>}
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
      {errors.username?.message && <Text>{errors.username.message}</Text>}

      <TouchableOpacity style={styles.pressable} onPress={handleSubmit(handle)}>
        <Text style={styles.pressableText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
