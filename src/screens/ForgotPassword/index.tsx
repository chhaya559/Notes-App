import {
  Pressable,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import CustomInput from "@components/atoms/CustomInput";
import { forgotSchema } from "src/validations/forgotSchema";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";

type ForgotScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ForgotPassword"
>;
export default function ForgotPassword({ navigation }: ForgotScreenProps) {
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
  function handle() {}
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
            text="Email address"
            placeholder="Emaill"
            color="#707070ff"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
      <TouchableOpacity style={styles.pressable}>
        <Text style={styles.pressableText} onPress={handleSubmit(handle)}>
          Reset password
        </Text>
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
