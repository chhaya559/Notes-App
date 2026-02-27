import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDeleteUserMutation } from "@redux/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { logout } from "@redux/slice/authSlice";
import Toast from "react-native-toast-message";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { db, pendingDb } from "src/db/notes";
import { notesTable } from "src/db/schema";
import { pendingNotes } from "src/db/pendingNotes/schema";

type props = {
  hasCommonPassword: boolean;
};
export default function AccountActions({ hasCommonPassword }: Readonly<props>) {
  const [deleteApi] = useDeleteUserMutation();
  const dispatch = useDispatch<AppDispatch>();
  const isGoogle = useSelector((state: RootState) => state.auth.isGoogle);
  const { dynamicStyles } = useStyles(styles);
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
      GoogleSignin.signOut();
      console.log("deleted");
      await db.delete(notesTable);
      await pendingDb.delete(pendingNotes);
      if (response.success) {
        Toast.show({
          text1: "Account Deleted Successfully!",
          visibilityTime: 1000,
          type: "success",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Not able to delete account",
        type: "error",
        swipeable: false,
        onPress: () => Toast.hide(),
      });
    }
  }

  const { Colors } = useTheme();
  return (
    <View style={dynamicStyles.container}>
      <TouchableOpacity
        style={dynamicStyles.wrapper}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <View style={dynamicStyles.wrap}>
          <Pressable style={dynamicStyles.iconWrap}>
            <MaterialIcons
              name="edit"
              size={20}
              style={{ padding: 3 }}
              color={Colors.iconPrimary}
            />
          </Pressable>
          <Text style={dynamicStyles.text}>Edit Profile Info</Text>
        </View>
        <TouchableOpacity
          style={dynamicStyles.actionIcon}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <SimpleLineIcons
            name="arrow-right"
            size={18}
            color={Colors.iconPrimary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={dynamicStyles.line} />
      {!isGoogle && (
        <>
          <TouchableOpacity
            style={dynamicStyles.wrapper}
            onPress={() => navigation.navigate("ResetPassword")}
          >
            <View style={dynamicStyles.wrap}>
              <Pressable style={dynamicStyles.iconWrap}>
                <MaterialIcons
                  name="password"
                  size={20}
                  color={Colors.iconPrimary}
                  style={{ padding: 3 }}
                />
              </Pressable>
              <Text style={dynamicStyles.text}>Change Password</Text>
            </View>
            <TouchableOpacity
              style={dynamicStyles.actionIcon}
              onPress={() => navigation.navigate("ResetPassword")}
            >
              <SimpleLineIcons
                name="arrow-right"
                color={Colors.iconPrimary}
                size={18}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={dynamicStyles.line} />
        </>
      )}
      {hasCommonPassword && (
        <>
          <TouchableOpacity
            style={dynamicStyles.wrapper}
            onPress={() => navigation.navigate("ChangeNotePassword")}
          >
            <View style={dynamicStyles.wrap}>
              <Pressable style={dynamicStyles.iconWrap}>
                <MaterialIcons
                  name="password"
                  size={20}
                  style={{ padding: 3 }}
                  color={Colors.iconPrimary}
                />
              </Pressable>
              <Text style={dynamicStyles.text}>Change Notes Password</Text>
            </View>
            <TouchableOpacity
              style={dynamicStyles.actionIcon}
              onPress={() => navigation.navigate("ChangeNotePassword")}
            >
              <SimpleLineIcons
                name="arrow-right"
                size={18}
                color={Colors.iconPrimary}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={dynamicStyles.line} />
        </>
      )}
      {hasCommonPassword && (
        <>
          <TouchableOpacity
            style={dynamicStyles.wrapper}
            onPress={() =>
              navigation.navigate("ForgotPassword", { name: "notes" })
            }
          >
            <View style={dynamicStyles.wrap}>
              <Pressable style={dynamicStyles.iconWrap}>
                <MaterialIcons
                  name="password"
                  size={20}
                  style={{ padding: 3 }}
                  color={Colors.iconPrimary}
                />
              </Pressable>
              <Text style={dynamicStyles.text}>Reset Notes Password</Text>
            </View>
            <TouchableOpacity
              style={dynamicStyles.actionIcon}
              onPress={() =>
                navigation.navigate("ForgotPassword", { name: "notes" })
              }
            >
              <SimpleLineIcons
                name="arrow-right"
                size={18}
                color={Colors.iconPrimary}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={dynamicStyles.line} />
        </>
      )}
      <TouchableOpacity style={dynamicStyles.wrapper} onPress={confirmDelete}>
        <View style={dynamicStyles.wrap}>
          <Pressable style={dynamicStyles.iconWrap}>
            <MaterialIcons
              name="delete"
              size={20}
              style={{ padding: 3 }}
              color={Colors.iconPrimary}
            />
          </Pressable>
          <Text style={dynamicStyles.text}>Delete Account</Text>
        </View>
        <TouchableOpacity
          style={dynamicStyles.actionIcon}
          onPress={confirmDelete}
        >
          <SimpleLineIcons
            name="arrow-right"
            size={18}
            color={Colors.iconPrimary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
