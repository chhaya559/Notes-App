import { Text, View, Image, Pressable } from "react-native";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { logout } from "@redux/slice/authSlice";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useDeleteUserMutation } from "@redux/api/authApi";

type ProfileProps = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function Profile({ navigation }: Readonly<ProfileProps>) {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const username = useSelector((state: RootState) => state.auth.firstName);
  const email = useSelector((state: RootState) => state.auth.email);
  const [deleteApi] = useDeleteUserMutation();
  function handleLogout() {
    dispatch(logout());
  }
  useEffect(() => {
    if (token == null) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Onboarding" }],
      });
    }
  }, [token]);
  async function handleDelete() {
    try {
      const response = await deleteApi().unwrap();
      dispatch(logout());
      if (response.success) {
        Toast.show({
          text1: "Account Deleted Successfully!",
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Not able to delete account",
      });
    }
  }

  if (!username) {
    return (
      <View>
        <View style={styles.upperContainer}>
          <Text style={styles.heading}>Profile</Text>
          <Text style={styles.text}>Manage your account settings</Text>
        </View>
        <View style={styles.profile}>
          <Image
            source={require("../../../assets/avatar.png")}
            style={styles.image}
          />
        </View>
        <Text style={styles.name}>Hi, Guest</Text>

        <Pressable
          style={styles.register}
          onPress={() => navigation.navigate("GuestConversion")}
        >
          <Text style={styles.registerText}> Register Yourself</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <Text style={styles.heading}>Profile</Text>
        <Text style={styles.text}>Manage your account settings</Text>
      </View>
      <View style={styles.profile}>
        <Image
          source={require("../../../assets/avatar.png")}
          style={styles.image}
        />
      </View>
      <Text style={styles.name}>Hi, {username}</Text>
      <Text style={styles.email}>{email}</Text>

      <Pressable
        style={styles.view}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.viewText}>Edit Profile</Text>
        <SimpleLineIcons name="arrow-right" size={16} style={styles.viewIcon} />
      </Pressable>
      <View style={styles.lowerContainer}>
        <Pressable
          style={styles.pressable}
          onPress={() => navigation.navigate("ResetPassword")}
        >
          <Text>Change Password</Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={handleLogout}>
          <AntDesign name="logout" size={16} />
          <Text>Logout</Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={handleDelete}>
          <Text>Delete Account</Text>
        </Pressable>
      </View>
    </View>
  );
}
