import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  useWindowDimensions,
} from "react-native";
import styles from "./styles";
import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import CustomInput from "../CustomInput";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { RenderHTML } from "react-native-render-html";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setNotesUnlocked, lockNotes } from "@redux/slice/authSlice";
import {
  useDeleteMutation,
  useNoteLockMutation,
  useUnlockNoteMutation,
} from "@redux/api/noteApi";
import { db } from "src/db/notes";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { notesTable } from "src/db/schema";
import { and, eq } from "drizzle-orm";
import { useNetInfo } from "@react-native-community/netinfo";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    // hour: "numeric",
    // minute: "numeric",
  });
}

export default function Card(props: any) {
  const { Colors } = useTheme();
  const { dynamicStyles } = useStyles(styles);

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.token);
  const { isConnected } = useNetInfo();
  const [deleteApi] = useDeleteMutation();
  const [lockApi] = useNoteLockMutation();
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
      await unlockNote({
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

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  async function lockNote() {
    try {
      const response = await lockApi({ id: String(props.id) }).unwrap();
      console.log(response);
    } catch (error: any) {
      Toast.show({ text1: "Failed to lock note" });
      console.log(error);
    }
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
        translateX: translation.value + 50,
      };
    });

    return (
      <View style={dynamicStyles.swipe}>
        <Reanimated.View style={[dynamicStyles.delete, animatedStyle]}>
          <TouchableOpacity onPress={confirmDelete}>
            <MaterialIcons
              name="delete-outline"
              size={38}
              color={Colors.swipeDeleteIcon}
              style={dynamicStyles.deleteIcon}
            />
          </TouchableOpacity>
        </Reanimated.View>
      </View>
    );
  }
  function LeftAction(
    progress: SharedValue<number>,
    translation: SharedValue<number>,
  ) {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        translateX: translation.value + 70,
      };
    });

    return (
      <View style={dynamicStyles.swipe}>
        <Reanimated.View style={[dynamicStyles.lock, animatedStyle]}>
          <TouchableOpacity onPress={lockNote}>
            <Entypo
              name="lock"
              size={38}
              color={Colors.swipeLockIcon}
              style={dynamicStyles.deleteIcon}
            />
          </TouchableOpacity>
        </Reanimated.View>
      </View>
    );
  }
  const firstLine = props.content
    ?.split(/\r?\n|<br\s*\/?>/)[0]
    ?.substring(0, 40);

  const contentToShow =
    firstLine?.length > 30 ? firstLine.substring(0, 30) + "..." : firstLine;

  const swipeRef = useRef<SwipeableMethods>(null);
  return (
    <>
      {showLockedModal && (
        <Modal isVisible backdropOpacity={0.5} style={dynamicStyles.modal}>
          <View>
            <Text style={dynamicStyles.unlockHeading}>Unlock Notes</Text>
            <TouchableOpacity>
              <AntDesign
                name="close"
                size={24}
                color="#5757f8"
                style={dynamicStyles.close}
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

            <Text style={dynamicStyles.timeText}>Unlock for</Text>

            <View style={dynamicStyles.counter}>
              {[5, 10, 20, 30, 50].map((min) => (
                <TouchableOpacity
                  key={min}
                  style={[
                    dynamicStyles.counterTime,
                    unlockValue.unlockMinutes === min &&
                      dynamicStyles.counterActive,
                  ]}
                  onPress={() =>
                    setUnlockValue((p) => ({ ...p, unlockMinutes: min }))
                  }
                >
                  <Text style={dynamicStyles.time}>{min}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleUnlock}
              style={dynamicStyles.pressable}
            >
              <Text style={dynamicStyles.pressableText}>Unlock</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      <View>
        <ReanimatedSwipeable
          enabled={!props.isPasswordProtected}
          enableTrackpadTwoFingerGesture
          renderRightActions={RightAction}
          renderLeftActions={LeftAction}
          rightThreshold={10}
          ref={swipeRef}
        >
          <Animated.View style={animatedStyle}>
            <TouchableOpacity
              style={[dynamicStyles.container]}
              onPress={handlePress}
              activeOpacity={1}
              onPressIn={() => {
                scale.value = withSpring(0.9);
              }}
              onPressOut={() => {
                scale.value = withSpring(1);
              }}
            >
              <Text style={dynamicStyles.heading}>
                {props.title.length > 20
                  ? props.title.substring(0, 20) + "..."
                  : props.title}
              </Text>

              <Text style={dynamicStyles.created}>
                {formatDate(props.updatedAt)}
              </Text>
              {props?.content?.trim()?.length > 0 && (
                <RenderHTML
                  source={{ html: contentToShow }}
                  contentWidth={width}
                  baseStyle={dynamicStyles.contentText}
                />
              )}

              <View style={dynamicStyles.iconsWrap}>
                {props.isLocked ? (
                  <Pressable style={dynamicStyles.icon}>
                    <Entypo name="lock" size={24} color={Colors.icon} />
                  </Pressable>
                ) : null}
                {props.isReminderSet ? (
                  <Pressable style={dynamicStyles.icon}>
                    <Feather name="clock" size={24} color="#000000ff" />
                  </Pressable>
                ) : null}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </ReanimatedSwipeable>
      </View>
    </>
  );
}
