import CustomInput from "@components/atoms/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGuestConversionMutation } from "@redux/api/authApi";
import { conversion } from "@redux/slice/authSlice";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { registerSchema } from "src/validations/registerSchema";
import style from "./styles";

export default function GuestConversion() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: "",
      username: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const dispatch = useDispatch();
  const [conversionApi] = useGuestConversionMutation();
  const [isVisible, setIsVisible] = useState(false);

  async function handleConversion(data: any) {
    try {
      console.log("jeukf");
      const response = await conversionApi(data).unwrap();
      console.log("response");
      if (response.success) {
        dispatch(
          conversion({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            username: response.data.userName,
            email: response.data.email,
          }),
        );
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Error converting guest to user",
      });
    }
  }
  return (
    <View style={style.container}>
      <Text style={style.heading}>Convert Guest to User</Text>
      <Text>Sign up to save your notes</Text>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            text="Username*"
            placeholder="Username"
            color="#707070ff"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {errors.username?.message && <Text>{errors.username.message}</Text>}
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            text="First Name*"
            placeholder="First Name"
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
            text="Last Name*"
            placeholder="Last Name"
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
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            text="Password*"
            placeholder="Password"
            color="#707070ff"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            isPassword
            isVisible={isVisible}
            onToggleVisibility={() => {
              setIsVisible((prev) => !prev);
            }}
            secureTextEntry={!isVisible}
          />
        )}
      />
      {errors.password?.message && <Text>{errors.password.message}</Text>}
      <Pressable
        onPress={handleSubmit(handleConversion)}
        style={style.pressable}
      >
        <Text>Convert to User</Text>
      </Pressable>
    </View>
  );
}
