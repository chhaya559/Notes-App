import { Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "@components/atoms/CustomInput";
import { forgotSchema } from "src/validations/forgotSchema";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { useForgotpasswordMutation } from "@redux/api/authApi";
import Toast from "react-native-toast-message";

type ForgotScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ForgotPassword"
>;
export default function ForgotPassword({
  navigation,
}: Readonly<ForgotScreenProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const [forgotapi, { isLoading, error }] = useForgotpasswordMutation();

  async function handle(data: any) {
    try {
      const response = await forgotapi({
        email: data.email,
      }).unwrap();
      if (response.success) {
        Toast.show({
          text1: "Email sent",
        });
      } else {
        Toast.show({
          text1: "Sign in failed",
        });
      }
    } catch (error: any) {
      Toast.show({
        text1: error?.data?.message || "Something went wrong",
      });
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot your password?</Text>
      <Text style={styles.text}>
        A code will be sent to your email to help reset password
      </Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value, onBlur } }) => (
          <CustomInput
            text="Email address*"
            placeholder="Emaill"
            color="#707070ff"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
      <TouchableOpacity style={styles.pressable} onPress={handleSubmit(handle)}>
        <Text style={styles.pressableText}>Reset password</Text>
      </TouchableOpacity>
      <Pressable
        style={styles.navigator}
        onPress={() => navigation.replace("Login")}
      >
        <Feather name="arrow-left" size={18} />
        <Text style={styles.backText}>Back to login</Text>
      </Pressable>
    </View>
  );
}
