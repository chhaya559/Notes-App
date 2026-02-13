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
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { edit, logout, profileImageUrl } from "@redux/slice/authSlice";
import Toast from "react-native-toast-message";
import {
  useDeleteUserMutation,
  useProfileImageMutation,
} from "@redux/api/authApi";
import { db } from "src/db/notes";
import { notesTable } from "src/db/schema";
import AccountActions from "@components/atoms/AccountActions";
import { launchImageLibrary } from "react-native-image-picker";
import { useEffect, useState } from "react";

type ProfileProps = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function Profile({ navigation }: Readonly<ProfileProps>) {
  const dispatch = useDispatch<AppDispatch>();

  const username = useSelector((state: RootState) => state.auth.firstName);
  const email = useSelector((state: RootState) => state.auth.email);
  const profileImage = useSelector(
    (state: RootState) => state.auth.profileImageUrl,
  );
  const [image, setImage] = useState(profileImage);
  useEffect(() => {
    setImage(profileImage);
  }, [profileImage, image]);
  const hasCommonPassword = useSelector(
    (state: RootState) => state.auth.isCommonPasswordSet,
  );
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
        { text: "Log out", style: "destructive", onPress: handleLogout },
      ],
      { cancelable: true },
    );
  }

  function confirmDelete() {
    Alert.alert(
      "Delete Account",
      "This action is permanent. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDelete },
      ],
      { cancelable: true },
    );
  }

  async function handleDelete() {
    try {
      const response = await deleteApi("").unwrap();
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
        const cacheBustedUrl = `${newUrl}?v=${Date.now()}`;

        dispatch(
          profileImageUrl({
            profileImageUrl: cacheBustedUrl,
          }),
        );

        setImage(cacheBustedUrl);
      }
      // dispatch(
      //   profileImageUrl({
      //     profileImageUrl: response?.data?.profileImageUrl,
      //   }),
      // );
      // const newUrl = response?.data?.profileImageUrl;
      // setImage(newUrl);
      console.log(response);
    } catch (error) {
      console.log("Error uploading file", error);
    }
  }

  if (!username) {
    return (
      <View>
        <View style={styles.upperContainer}>
          <Text style={styles.text}>Manage your account settings</Text>
        </View>

        <View style={styles.profile}>
          <Image
            key={profileImage}
            source={{ uri: profileImage }}
            style={styles.image}
          />
        </View>

        <Text style={styles.name}>Hi, Guest</Text>

        <Pressable
          style={styles.pressable}
          onPress={() => navigation.navigate("GuestConversion")}
        >
          <Text style={styles.registerText}>Register Yourself</Text>
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
          key={profileImage}
          source={{ uri: profileImage }}
          style={styles.image}
        />
        {/* onPress={pickFile} */}
        <TouchableOpacity style={styles.editImage} onPress={pickFile}>
          <MaterialIcons name="edit" size={24} color="black" />
          {/* <Feather name="camera" size={24} color="black" /> */}
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>Hi, {username}</Text>
      <Text style={styles.email}>{email}</Text>

      <AccountActions hasCommonPassword={hasCommonPassword} />

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
