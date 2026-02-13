import {
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { edit, logout } from "@redux/slice/authSlice";
import Toast from "react-native-toast-message";
import {
  useDeleteUserMutation,
  useGetUserQuery,
  useProfileImageMutation,
} from "@redux/api/authApi";
import { db } from "src/db/notes";
import { notesTable } from "src/db/schema";
import AccountActions from "@components/atoms/AccountActions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useState } from "react";
import { useUpdateMutation } from "@redux/api/noteApi";

type ProfileProps = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function Profile({ navigation }: Readonly<ProfileProps>) {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useGetUserQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [updateApi] = useUpdateMutation();
  const username = useSelector((state: RootState) => state.auth.firstName);
  const email = useSelector((state: RootState) => state.auth.email);
  const profileImage = useSelector(
    (state: RootState) => state.auth.profileImageUrl,
  );
  const hasCommonPassword = useSelector(
    (state: RootState) => state.auth.isCommonPasswordSet,
  );
  const [image, setImage] = useState(profileImage);
  const [deleteApi] = useDeleteUserMutation();
  const [uploadProfile] = useProfileImageMutation();

  async function handleLogout() {
    try {
      await db.delete(notesTable);
      dispatch(logout());
    } catch (error) {
      console.log("Logout failed", error);
    }
  }

  function confirmLogout() {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: handleLogout,
        },
      ],
      { cancelable: true },
    );
  }
  async function pickFile() {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 1,
      });

      if (result.didCancel) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      const formData = new FormData();
      formData.append("image", {
        uri: asset.uri,
        type: asset.type || "image/jpeg",
        name: asset.fileName || "profile.jpg",
      } as any);

      const response = await uploadProfile(formData).unwrap();

      const newUrl = response?.data?.profileImageUrl;

      if (newUrl) {
        dispatch(
          edit({
            profileImageUrl: newUrl,
          }),
        );
        setImage(newUrl);
      }
    } catch (error) {
      console.log("Error uploading file", error);
    }
  }

  // async function pickFile() {
  //   try {
  //     const result = await launchImageLibrary({
  //       mediaType: "photo",
  //     });
  //     const formData = new FormData();

  //     formData.append("image", {
  //       uri: result?.assets?.uri,
  //       type: result?.assets.type ?? "application/octet-stream",
  //       name: result?.assets.name ?? "file",
  //     } as any);
  //     const response = await uploadProfile(result?.assets?.uri);
  //     console.log(response, "resposne for updateApi");
  //     if (result.assets) {
  //       setImage(result?.assets?.uri);
  //     }
  //     console.log(result, "result from image upload");
  //   } catch (error) {
  //     console.log("Error uploading file", error);
  //   }
  // }
  function confirmDelete() {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: () => handleDelete,
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

  if (!username) {
    return (
      <View>
        <View style={styles.upperContainer}>
          {/* <Text style={styles.heading}>Profile</Text> */}
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
          style={styles.pressable}
          onPress={() => navigation.navigate("GuestConversion")}
        >
          <Text style={styles.registerText}> Register Yourself</Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={confirmLogout}>
          <AntDesign name="logout" size={18} color="#fff" />
          <Text style={styles.registerText}>Logout</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <Text style={styles.text}>Manage your account settings</Text>
      </View>
      <View style={styles.profile}>
        <Image
          source={
            profileImage
              ? { uri: image }
              : require("../../../assets/avatar.png")
          }
          style={styles.image}
        />
        <TouchableOpacity style={styles.editImage} onPress={pickFile}>
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>Hi, {username}</Text>
      <Text style={styles.email}>{email}</Text>
      <AccountActions hasCommonPassword />
      <TouchableOpacity
        style={[styles.pressable, styles.logout]}
        onPress={confirmLogout}
      >
        <AntDesign name="logout" size={18} color="#fff" />
        <Text style={styles.registerText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
