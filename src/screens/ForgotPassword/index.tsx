import { Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "@components/atoms/CustomInput";
import { forgotSchema } from "src/validations/forgotSchema";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { useForgotpasswordMutation } from "@redux/api/authApi";
import Toast from "react-native-toast-message";
import Modal from "react-native-modal";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [forgotapi] = useForgotpasswordMutation();

  async function handle(data: any) {
    try {
      const response = await forgotapi({
        email: data.email,
      }).unwrap();
      if (response.success) {
        Toast.show({
          text1: "Email sent",
          visibilityTime: 2000,
          onHide: () => setIsModalVisible(true),
        });
      } else {
        Toast.show({
          text1: "Sign in failed",
        });
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        text1: error?.data?.message || "Something went wrong",
      });
    }
  }
  return (
    <>
      <Modal isVisible={isModalVisible} backdropOpacity={0.8}>
        <View style={styles.modal}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons
              name="email-open"
              size={42}
              color="#5757f8"
            />
          </View>
          <Text style={styles.modalHeading}>Reset your Password</Text>
          <Text style={styles.modalText}>
            Check your email for a link to reset your password. If it doesn't
            appear within a few minutes,check your spam folder.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.replace("Login")}
            style={styles.backButtom}
          >
            <Text style={styles.modalLogin}>Back to login</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.cross}
          onPress={() => setIsModalVisible(false)}
        >
          <Entypo name="cross" size={26} color="#5757f8" />
        </TouchableOpacity>
      </Modal>
      <KeyboardAwareScrollView style={styles.container}>
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
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}
        <TouchableOpacity
          style={styles.pressable}
          onPress={handleSubmit(handle)}
        >
          <Text style={styles.pressableText}>Reset password</Text>
        </TouchableOpacity>
        <Pressable
          style={styles.navigator}
          onPress={() => navigation.replace("Login")}
        >
          <Feather name="arrow-left" size={18} />
          <Text style={styles.backText}>Back to login</Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </>
  );
}
