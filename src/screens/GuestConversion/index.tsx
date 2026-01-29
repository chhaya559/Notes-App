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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";

type ConversionProps = NativeStackScreenProps<
  RootStackParamList,
  "GuestConversion"
>;
export default function GuestConversion({
  navigation,
}: Readonly<ConversionProps>) {
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
      console.log(data, "ftyjf");
      const response = await conversionApi({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        username: data.username,
      }).unwrap();

      if (response.success) {
        dispatch(
          conversion({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            username: response.data.userName,
            email: response.data.email,
          }),
        );
        Toast.show({
          text1: "Guest converted to User",
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Error converting guest to user",
      });
    }
    navigation.replace("Dashboard");
  }
  return (
    <View style={style.container}>
      <Text style={style.heading}>Convert Guest to User</Text>
      <Text style={style.text}>Sign up to save your notes</Text>
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

      {errors.username?.message && (
        <Text style={style.error}>{errors.username.message}</Text>
      )}
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
      {errors.firstName?.message && (
        <Text style={style.error}>{errors.firstName.message}</Text>
      )}
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
      {errors.lastName?.message && (
        <Text style={style.error}>{errors.lastName.message}</Text>
      )}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            text="Email*"
            placeholder="Email"
            color="#707070ff"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.email?.message && (
        <Text style={style.error}>{errors.email.message}</Text>
      )}
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
      {errors.password?.message && (
        <Text style={style.error}>{errors.password.message}</Text>
      )}
      <Pressable
        onPress={handleSubmit(handleConversion)}
        style={style.pressable}
      >
        <Text style={style.pressableText}>Convert to User</Text>
      </Pressable>
    </View>
  );
}
