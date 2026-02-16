import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDeleteUserMutation } from "@redux/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { logout } from "@redux/slice/authSlice";
import Toast from "react-native-toast-message";

type props = {
  hasCommonPassword: boolean;
};
export default function AccountActions({ hasCommonPassword }: Readonly<props>) {
  const [deleteApi] = useDeleteUserMutation();
  const dispatch = useDispatch<AppDispatch>();
  const isGoogle = useSelector((state: RootState) => state.auth.isGoogle);

  const navigation = useNavigation<any>();

  function confirmDelete() {
    Alert.alert(
      "Log out",
      "Are you sure you want to delete this Accont? After deleting you will lost all the app data",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDelete,
        },
      ],
      { cancelable: true },
    );
  }
  async function handleDelete() {
    try {
      const response = await deleteApi(" ").unwrap();
      dispatch(logout());
      if (response.success) {
        Toast.show({
          text1: "Account Deleted Successfully!",
          visibilityTime: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Not able to delete account",
      });
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.wrapper}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <View style={styles.wrap}>
          <Pressable style={styles.iconWrap}>
            <MaterialIcons name="edit" size={20} style={{ padding: 3 }} />
          </Pressable>
          <Text style={styles.text}>Edit Profile Info</Text>
        </View>
        <TouchableOpacity style={styles.actionIcon}>
          <SimpleLineIcons name="arrow-right" size={18} />
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.line} />
      {!isGoogle && (
        <TouchableOpacity
          style={styles.wrapper}
          onPress={() => navigation.navigate("ResetPassword")}
        >
          <View style={styles.wrap}>
            <Pressable style={styles.iconWrap}>
              <MaterialIcons name="password" size={20} style={{ padding: 3 }} />
            </Pressable>
            <Text style={styles.text}>Change Password</Text>
          </View>
          <TouchableOpacity style={styles.actionIcon}>
            <SimpleLineIcons name="arrow-right" size={18} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      <View style={styles.line} />
      {hasCommonPassword && (
        <TouchableOpacity
          style={styles.wrapper}
          onPress={() => navigation.navigate("ChangeNotePassword")}
        >
          <View style={styles.wrap}>
            <Pressable style={styles.iconWrap}>
              <MaterialIcons name="password" size={20} style={{ padding: 3 }} />
            </Pressable>
            <Text style={styles.text}>Notes Password</Text>
          </View>
          <TouchableOpacity style={styles.actionIcon}>
            <SimpleLineIcons name="arrow-right" size={18} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      <View style={styles.line} />
      <TouchableOpacity style={styles.wrapper} onPress={confirmDelete}>
        <View style={styles.wrap}>
          <Pressable style={styles.iconWrap}>
            <MaterialIcons name="delete" size={20} style={{ padding: 3 }} />
          </Pressable>
          <Text style={styles.text}>Delete Account</Text>
        </View>
        <TouchableOpacity style={styles.actionIcon}>
          <SimpleLineIcons name="arrow-right" size={18} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
