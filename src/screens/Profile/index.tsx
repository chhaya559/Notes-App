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
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { logout, profileImageUrl } from "@redux/slice/authSlice";
import Toast from "react-native-toast-message";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  useDeleteImageMutation,
  useDeleteUserMutation,
  useProfileImageMutation,
} from "@redux/api/authApi";
import { db } from "src/db/notes";
import { notesTable } from "src/db/schema";
import AccountActions from "@components/atoms/AccountActions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useEffect, useRef, useState } from "react";

type ProfileProps = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function Profile({ navigation }: Readonly<ProfileProps>) {
  const dispatch = useDispatch<AppDispatch>();

  const username = useSelector((state: RootState) => state.auth.firstName);
  const email = useSelector((state: RootState) => state.auth.email);
  const isGoogle = useSelector((state: RootState) => state.auth.isGoogle);
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
  const [deleteProfileImage] = useDeleteImageMutation();

  const bottomSheetRef = useRef<any>(null);

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
  async function deleteProfile() {
    try {
      const response = await deleteProfileImage().unwrap();

      dispatch(
        profileImageUrl({
          profileImageUrl: "",
        }),
      );
      console.log(response, "remove profile");
      bottomSheetRef.current.close();
    } catch (error) {
      Toast.show({
        text1: "Error removing current photo",
      });
      console.log("Error deleting profile image", error);
    }
  }

  useEffect(() => {
    setImage(profileImage);
  }, [profileImage]);

  async function openCamera() {
    try {
      const result = await launchCamera({
        mediaType: "photo",
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
        const Url = `${newUrl}?v=${Date.now()}`;

        dispatch(
          profileImageUrl({
            profileImageUrl: Url,
          }),
        );

        setImage(Url);
      }
      console.log(response);
      bottomSheetRef?.current?.close();
    } catch (error) {
      console.log("Error uploading file", error);
      Toast.show({
        text1: "Error uploading image",
      });
    }
  }

  async function pickImage() {
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
        const Url = `${newUrl}?v=${Date.now()}`;

        dispatch(
          profileImageUrl({
            profileImageUrl: Url,
          }),
        );

        setImage(Url);
      }
      console.log(response);
      bottomSheetRef?.current?.close();
    } catch (error) {
      console.log("Error uploading file", error);
      Toast.show({
        text1: "Error uploading image",
      });
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
          source={
            profileImage
              ? { uri: profileImage }
              : require("../../../assets/default.png")
          }
          style={styles.image}
        />
        {/* onPress={pickFile} */}
        {!isGoogle && (
          <TouchableOpacity style={styles.editImage}>
            <MaterialIcons
              name="edit"
              size={24}
              color="black"
              onPress={() => bottomSheetRef?.current?.open()}
            />
          </TouchableOpacity>
        )}
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
      <RBSheet
        ref={bottomSheetRef}
        closeOnPressBack={true}
        height={280}
        customStyles={{
          wrapper: {
            // backgroundColor: "transparent",
          },
          container: {
            borderRadius: 20,
            backgroundColor: "#f5f5f5",
            height: 280,
          },
        }}
      >
        <View style={styles.bottomsheetContainer}>
          <Text style={styles.profileText}>Profile Picture</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionsStyle} onPress={pickImage}>
              <Ionicons name="images" size={24} color="#5757f8" />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity style={styles.optionsStyle} onPress={openCamera}>
              <Entypo name="camera" size={24} color="#5757f8" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>
            <View style={styles.line} />

            <TouchableOpacity
              style={styles.optionsStyle}
              onPress={deleteProfile}
            >
              <AntDesign name="delete" size={24} color="#5757f8" />
              <Text style={styles.optionText}>Remove Current Photo</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.close}
            onPress={() => bottomSheetRef?.current?.close()}
          >
            <EvilIcons name="close-o" size={28} color="#5757f8" />
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
}
