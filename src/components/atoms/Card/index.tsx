import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import styles from "./styles";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import CustomInput from "../CustomInput";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { RenderHTML } from "react-native-render-html";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setNotesUnlocked, lockNotes } from "@redux/slice/authSlice";
import { useDeleteMutation, useUnlockNoteMutation } from "@redux/api/noteApi";
import { db } from "src/db/notes";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { notesTable } from "src/db/schema";
import { and, eq } from "drizzle-orm";
import { useNetInfo } from "@react-native-community/netinfo";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export default function Card(props: any) {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.token);
  const { isConnected } = useNetInfo();
  const [deleteApi] = useDeleteMutation();
  const notesUnlockUntil = useSelector(
    (state: RootState) => state.auth.notesUnlockUntil,
  );
  const isNotesUnlocked = useSelector(
    (state: RootState) => state.auth.isNotesUnlocked,
  );

  const [unlockNote] = useUnlockNoteMutation();

  const [showLockedModal, setShowLockedModal] = useState(false);

  const [unlockValue, setUnlockValue] = useState<{
    password: string;
    unlockMinutes: number | null;
  }>({
    password: "",
    unlockMinutes: null,
  });
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!notesUnlockUntil) return;

    const remaining = notesUnlockUntil - Date.now();

    if (remaining <= 0) {
      dispatch(lockNotes());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(lockNotes());
    }, remaining);

    return () => clearTimeout(timer);
  }, [notesUnlockUntil]);

  async function handleUnlock() {
    if (!unlockValue.password || !unlockValue.unlockMinutes) {
      Toast.show({ text1: "Enter password & select time" });
      return;
    }

    try {
      const res: any = await unlockNote({
        password: unlockValue.password,
        unlockMinutes: unlockValue.unlockMinutes,
      }).unwrap();

      const unlockUntil = Date.now() + unlockValue.unlockMinutes * 60 * 1000;

      dispatch(setNotesUnlocked({ unlockUntil }));

      setShowLockedModal(false);

      navigation.navigate("CreateNote", { id: props.id });
    } catch (error) {
      Toast.show({
        text1: error?.data?.message,
      });
    }
  }
  async function handleDelete() {
    try {
      await db
        .delete(notesTable)
        .where(
          and(eq(notesTable.id, props.id), eq(notesTable?.userId, userId)),
        );
      if (isConnected) {
        await deleteApi({ id: props.id }).unwrap();
      }
      Toast.show({
        text1: "Deleted",
      });
    } catch (error) {
      console.log("Delete error:", error);
      Toast.show({
        text1: "Not able to delete this",
      });
    }
  }

  function handlePress() {
    const isStillUnlocked =
      isNotesUnlocked && notesUnlockUntil && Date.now() < notesUnlockUntil;

    if ((props.isLocked || props.isPasswordProtected) && !isStillUnlocked) {
      setShowLockedModal(true);
      return;
    }

    navigation.navigate("CreateNote", { id: props.id });
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
  function RightAction(
    progress: SharedValue<number>,
    translation: SharedValue<number>,
  ) {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        translateX: translation.value + 70,
      };
    });

    return (
      <View style={styles.swipe}>
        <Reanimated.View style={[styles.delete, animatedStyle]}>
          <TouchableOpacity onPress={confirmDelete}>
            <MaterialIcons
              name="delete-outline"
              size={38}
              color="white"
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </Reanimated.View>
        <Reanimated.View style={[styles.delete, animatedStyle]}>
          <TouchableOpacity onPress={confirmDelete}>
            <MaterialIcons
              name="delete-outline"
              size={38}
              color="white"
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </Reanimated.View>
      </View>
    );
  }

  return (
    <>
      {showLockedModal && (
        <Modal isVisible backdropOpacity={0.5} style={styles.modal}>
          <View>
            <Text style={styles.unlockHeading}>Unlock Notes</Text>
            <TouchableOpacity>
              <AntDesign
                name="close"
                size={24}
                color="#5757f8"
                style={styles.close}
                onPress={() => setShowLockedModal(false)}
              />
            </TouchableOpacity>
            <CustomInput
              placeholder="Enter password"
              color="#707070ff"
              value={unlockValue.password}
              onChangeText={(text: string) =>
                setUnlockValue((p) => ({ ...p, password: text }))
              }
              isPassword
            />

            <Text style={styles.timeText}>Unlock for</Text>

            <View style={styles.counter}>
              {[5, 10, 20, 30, 50].map((min) => (
                <TouchableOpacity
                  key={min}
                  style={[
                    styles.counterTime,
                    unlockValue.unlockMinutes === min && styles.counterActive,
                  ]}
                  onPress={() =>
                    setUnlockValue((p) => ({ ...p, unlockMinutes: min }))
                  }
                >
                  <Text style={styles.time}>{min}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleUnlock} style={styles.pressable}>
              <Text style={styles.pressableText}>Unlock</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      <View>
        <ReanimatedSwipeable
          enabled={!props.isPasswordProtected}
          enableTrackpadTwoFingerGesture
          renderRightActions={RightAction}
          rightThreshold={10}
        >
          <TouchableOpacity
            style={[
              styles.container,
              { backgroundColor: props.backgroundColor },
            ]}
            onPress={handlePress}
          >
            <Text style={styles.heading}>{props.title.substring(0, 20)}</Text>
            <View style={styles.createdContainer}>
              <Feather name="calendar" size={16} color="#656565ff" />
              <Text style={styles.created}>{formatDate(props.updatedAt)}</Text>
            </View>
            {props?.content?.trim()?.length > 0 && (
              <RenderHTML
                source={{ html: props.content.substring(0, 25) }}
                contentWidth={width}
              />
            )}

            <View style={styles.iconsWrap}>
              {props.isLocked ? (
                <Pressable style={styles.icon}>
                  <Feather name="lock" size={24} color="#000000ff" />
                </Pressable>
              ) : null}
              {props.isReminderSet ? (
                <Pressable style={styles.icon}>
                  <Feather name="clock" size={24} color="#000000ff" />
                </Pressable>
              ) : null}
            </View>
          </TouchableOpacity>
        </ReanimatedSwipeable>
      </View>
    </>
  );
}
