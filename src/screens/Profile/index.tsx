import {
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageStyle,
  ViewStyle,
  Platform,
} from "react-native";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import {
  AntDesign,
  Entypo,
  EvilIcons,
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
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import useTheme from "@hooks/useTheme";
import useStyles from "@hooks/useStyles";

type ProfileProps = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function Profile({ navigation }: Readonly<ProfileProps>) {
  const dispatch = useDispatch<AppDispatch>();
  const { Colors } = useTheme();
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
      GoogleSignin.signOut();
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
    const permissionType = Platform.select({
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    });
    try {
      const permissionResult = await request(permissionType);
      switch (permissionResult) {
        case RESULTS.GRANTED:
          console.log("You can use the camera");
          break;
        case RESULTS.DENIED:
          console.log("Permission denied to use camera");

          return;
        case RESULTS.UNAVAILABLE:
          console.log("Feature not available on this device.");

          break;
      }

      const result = await launchCamera({
        mediaType: "photo",
      });
      bottomSheetRef?.current?.close();

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
    } catch (error) {
      console.log("Error uploading file", error);
      Toast.show({
        text1: "Error uploading image",
      });
    }
  }

  async function pickImage() {
    try {
      let permissionResult;
      if (Platform.OS === "android") {
        if (Platform.Version >= 33) {
          permissionResult = await request(
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          );
        } else {
          permissionResult = await request(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          );
        }
      } else {
        permissionResult = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
      }
      switch (permissionResult) {
        case RESULTS.GRANTED:
          console.log("You can use the media images");
          break;
        case RESULTS.DENIED:
          Toast.show({
            text1: "Permission denied to access images",
          });
          console.log("Permission denied to access images");
          return;
        case RESULTS.UNAVAILABLE:
          Toast.show({
            text1: "Feature not available on this device",
          });
          console.log("Feature not available on this device.");
          return;
      }

      const result = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 1,
      });
      bottomSheetRef?.current?.close();

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
    } catch (error) {
      console.log("Error uploading file", error);
      if (error?.data?.errors[0]) {
        Toast.show({
          text1: error?.data?.errors[0],
        });
      } else {
        Toast.show({
          text1: "Error uploading image",
        });
      }
    }
  }
  const { dynamicStyles } = useStyles(styles);
  if (!username) {
    return (
      <View style={{ backgroundColor: Colors.background, height: "100%" }}>
        <View style={dynamicStyles.upperContainer}>
          <Text style={dynamicStyles.text}>Manage your account settings</Text>
        </View>

        <View style={dynamicStyles.profile as ViewStyle}>
          <Image
            key={profileImage}
            source={{ uri: profileImage }}
            style={dynamicStyles.image as ImageStyle}
          />
        </View>

        <Text style={dynamicStyles.name}>Hi, Guest</Text>

        <Pressable
          style={dynamicStyles.pressable}
          onPress={() => navigation.navigate("GuestConversion")}
        >
          <Text style={dynamicStyles.registerText}>Register Yourself</Text>
        </Pressable>

        <Pressable style={dynamicStyles.pressable} onPress={confirmLogout}>
          <AntDesign name="logout" size={18} color={Colors.buttonIcon} />
          <Text style={dynamicStyles.registerText}>Logout</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <ScrollView style={dynamicStyles.container} bounces={false}>
      <View style={dynamicStyles.upperContainer}>
        <Text style={dynamicStyles.text}>Manage your account settings</Text>
      </View>

      <View style={dynamicStyles.profile}>
        <Image
          key={profileImage}
          source={
            profileImage
              ? { uri: profileImage }
              : require("../../../assets/default.png")
          }
          style={dynamicStyles.image as ImageStyle}
        />
        {/* onPress={pickFile} */}
        {!isGoogle && (
          <TouchableOpacity style={dynamicStyles.editImage}>
            <MaterialIcons
              name="edit"
              size={24}
              color={Colors.icon}
              onPress={() => bottomSheetRef?.current?.open()}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={dynamicStyles.name}>Hi, {username}</Text>
      <Text style={dynamicStyles.email}>{email}</Text>

      <AccountActions hasCommonPassword={hasCommonPassword} />

      <TouchableOpacity
        style={[dynamicStyles.pressable, dynamicStyles.logout]}
        onPress={confirmLogout}
      >
        <AntDesign name="logout" size={18} color={Colors.buttonIcon} />
        <Text style={dynamicStyles.registerText}>Logout</Text>
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
            backgroundColor: Colors.surface,
            height: 280,
          },
        }}
      >
        <View style={dynamicStyles.bottomsheetContainer}>
          <Text style={dynamicStyles.profileText}>Profile Picture</Text>
          <View style={dynamicStyles.optionsContainer}>
            <TouchableOpacity
              style={dynamicStyles.optionsStyle}
              onPress={pickImage}
            >
              <Ionicons name="images" size={24} color={Colors.icon} />

              <Text style={dynamicStyles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <View style={dynamicStyles.line} />
            <TouchableOpacity
              style={dynamicStyles.optionsStyle}
              onPress={openCamera}
            >
              <Entypo name="camera" size={24} color={Colors.icon} />
              <Text style={dynamicStyles.optionText}>Take Photo</Text>
            </TouchableOpacity>
            <View style={dynamicStyles.line} />

            <TouchableOpacity
              style={dynamicStyles.optionsStyle}
              onPress={deleteProfile}
            >
              <AntDesign name="delete" size={24} color={Colors.icon} />
              <Text style={dynamicStyles.optionText}>Remove Current Photo</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={dynamicStyles.close}
            onPress={() => bottomSheetRef?.current?.close()}
          >
            <EvilIcons name="close-o" size={28} color={Colors.icon} />
          </TouchableOpacity>
        </View>
      </RBSheet>
    </ScrollView>
  );
}
