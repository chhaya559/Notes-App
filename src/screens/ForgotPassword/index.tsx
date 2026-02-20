import { Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "@components/atoms/CustomInput";
import { forgotSchema } from "src/validations/forgotSchema";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import {
  useForgotNotesPasswordMutation,
  useForgotpasswordMutation,
} from "@redux/api/authApi";
import Toast from "react-native-toast-message";
import Modal from "react-native-modal";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
type ForgotScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ForgotPassword"
>;

export default function ForgotPassword({
  navigation,
  route,
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
  const isNotesReset = Boolean(route?.params?.name);
  console.log(isNotesReset, "resetrest");
  const [forgotapi] = useForgotpasswordMutation();
  const [forgotNotesApi] = useForgotNotesPasswordMutation();

  async function handle(data: any) {
    try {
      if (isNotesReset) {
        const response = await forgotNotesApi({
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
            text1: "Email not sent",
          });
        }
      } else {
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
            text1: "Email not sent",
          });
        }
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        text1: error?.data?.message || "Something went wrong",
      });
    }
  }
  useEffect(() => {
    let timer: any;
    if (isModalVisible) {
      timer = setTimeout(() => {
        setIsModalVisible(false);
        navigation.goBack();
      }, 4000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isModalVisible]);
  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();
  return (
    <>
      <Modal isVisible={isModalVisible} backdropOpacity={0.8}>
        <View style={dynamicStyles.modal}>
          <View style={dynamicStyles.iconWrap}>
            <MaterialCommunityIcons
              name="email-open"
              size={42}
              color={Colors.icon}
            />
          </View>
          <Text style={dynamicStyles.modalHeading}>Reset your Password</Text>
          <Text style={dynamicStyles.modalText}>
            Check your email for a link to reset your password. If it doesn't
            appear within a few minutes,check your spam folder.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={dynamicStyles.backButtom}
          >
            <Text style={dynamicStyles.modalLogin}>Go Back</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={dynamicStyles.cross}
          onPress={() => setIsModalVisible(false)}
        >
          <Entypo name="cross" size={26} color={Colors.icon} />
        </TouchableOpacity>
      </Modal>
      <KeyboardAwareScrollView style={dynamicStyles.container}>
        <Text style={dynamicStyles.heading}>Forgot your password?</Text>
        <Text style={dynamicStyles.text}>
          A link will be sent to your email to help reset password
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
              text="Email address*"
              placeholder="Emaill"
              color={Colors.placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.email && (
          <Text style={dynamicStyles.error}>{errors.email.message}</Text>
        )}
        <TouchableOpacity
          style={dynamicStyles.pressable}
          onPress={handleSubmit(handle)}
        >
          <Text style={dynamicStyles.pressableText}>Reset password</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </>
  );
}
