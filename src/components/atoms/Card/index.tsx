import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  useWindowDimensions,
  ScrollView,
  KeyboardAvoidingView,
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
import { setNotesUnlocked, lockNotes, isGuest } from "@redux/slice/authSlice";
import {
  useDeleteMutation,
  useNoteLockMutation,
  useRemoveLockMutation,
  useUnlockNoteMutation,
} from "@redux/api/noteApi";
import { db, pendingDb } from "src/db/notes";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { notesTable } from "src/db/schema";
import { eq } from "drizzle-orm";
import { useNetInfo } from "@react-native-community/netinfo";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
import { pendingNotes } from "src/db/pendingNotes/schema";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
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
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
  const [removeLockApi] = useRemoveLockMutation();
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
  }, [notesUnlockUntil, dispatch]);
  //},[notesUnlockUntil, dispatch]);

  async function handleUnlock() {
    if (!unlockValue.password || !unlockValue.unlockMinutes) {
      Toast.show({ text1: "Enter password & select time" });
      return;
    }
    if (!isConnected) {
      Toast.show({
        text1: "This feature requires internet",
      });
    }
    try {
      await unlockNote({
        password: unlockValue.password,
        unlockMinutes: unlockValue.unlockMinutes,
      }).unwrap();

      const unlockUntil = Date.now() + unlockValue.unlockMinutes * 60 * 1000;

      dispatch(setNotesUnlocked({ unlockUntil }));

      setShowLockedModal(false);

      navigation.navigate("CreateNote", {
        id: props.id,
        title: props.title,
        content: props.content,
      });
    } catch (error) {
      Toast.show({
        text1: error?.data?.message,
      });
    }
  }

  async function handleDelete() {
    try {
      if (!userId) return;
      if (isConnected) {
        await deleteApi({ id: props.id }).unwrap();
        await db.delete(notesTable).where(eq(notesTable.id, props.id));
      } else {
        await pendingDb
          .insert(pendingNotes)
          .values({
            id: props.id,
            userId,
            syncStatus: 3,
          })
          .onConflictDoUpdate({
            target: pendingNotes.id,
            set: {
              syncStatus: 3,
            },
          });
        console.log(
          "pendingdelete",
          await pendingDb.select().from(pendingNotes),
        );
        await db.delete(notesTable).where(eq(notesTable.id, props.id));
        console.log("notes in local", await db.select().from(notesTable));
      }
      if (props.onDeleteSuccess) {
        await props.onDeleteSuccess();
      }

      Toast.show({ text1: "Note Deleted" });
    } catch (error) {
      console.log("Delete error:", error);
      Toast.show({
        text1: error?.data?.message,
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

    navigation.navigate("CreateNote", {
      id: props.id,
      title: props.title,
      content: props.content,
      filePaths: props.filePaths,
    });
  }

  const hasCommonPassword = useSelector(
    (state: RootState) => state.auth.isCommonPasswordSet,
  );
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  async function unLockNote() {
    if (!isConnected) {
      Toast.show({
        text1: "This feature requires internet",
      });
    }
    try {
      const response = await removeLockApi({
        id: String(props.id),
      }).unwrap();

      console.log(response);
      if (response.success) {
        Toast.show({
          text1: "Note Lock Removed",
        });
        swipeRef.current?.close();
      }
    } catch (error: any) {
      if (error.data.message) {
        Toast.show({
          text2: error?.data?.message,
          position: "top",
        });
      } else {
        Toast.show({ text1: "Failed to remove lock from note" });
      }
      console.log(error);
    }
  }

  async function lockNote() {
    try {
      if (!isConnected) {
        Toast.show({
          text1: "This feature requires internet",
        });
      }

      if (!hasCommonPassword) {
        Alert.alert(
          "Set Notes Password",
          "Set notes password first to protect your notes.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Set Password",
              style: "destructive",
              onPress: () =>
                navigation.navigate("NotesPassword", {
                  noteID: props.id,
                }),
            },
          ],
          { cancelable: true },
        );
        return;
      }
      const response = await lockApi({
        id: String(props.id),
        isPasswordProtected: true,
      }).unwrap();

      console.log(response);
      if (response.success) {
        Toast.show({
          text1: "Note Locked",
        });
        swipeRef.current?.close();
      }
    } catch (error: any) {
      if (error.data.message) {
        Toast.show({
          text2: error?.data?.message,
          position: "top",
        });
      } else {
        Toast.show({ text1: "Failed to lock note" });
      }
      console.log(error);
    }
  }

  function confirmDelete() {
    Alert.alert(
      "Delete Note",
      "This action is permanent. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await handleDelete();
            swipeRef.current?.close();
          },
        },
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
        translateX: translation.value + 150,
      };
    });

    return (
      <Animated.View style={[dynamicStyles.swipeAction, animatedStyle]}>
        <TouchableOpacity
          onPress={confirmDelete}
          style={dynamicStyles.deleteBg}
        >
          <MaterialIcons
            name="delete-outline"
            size={38}
            color={Colors.danger}
          />
        </TouchableOpacity>
        {props.isPasswordProtected ? (
          <TouchableOpacity onPress={unLockNote} style={dynamicStyles.lockBg}>
            <Entypo name="lock-open" size={38} color={Colors.iconPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={lockNote} style={dynamicStyles.lockBg}>
            <Entypo name="lock" size={38} color={Colors.iconPrimary} />
          </TouchableOpacity>
        )}
      </Animated.View>
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
      <View>
        <ReanimatedSwipeable
          enableTrackpadTwoFingerGesture
          renderRightActions={RightAction}
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
                {props.isPasswordProtected ? (
                  <Pressable>
                    <Entypo name="lock" size={24} color={Colors.iconPrimary} />
                  </Pressable>
                ) : null}
                {props.isReminderSet ? (
                  <Pressable>
                    <Feather
                      name="clock"
                      size={24}
                      color={Colors.iconSecondary}
                    />
                  </Pressable>
                ) : null}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </ReanimatedSwipeable>
      </View>

      {showLockedModal && (
        <Modal
          isVisible={showLockedModal}
          backdropOpacity={0.2}
          style={dynamicStyles.modal}
        >
          <View>
            <KeyboardAwareScrollView bounces={false}>
              <Text style={dynamicStyles.unlockHeading}>Unlock Notes</Text>
              <TouchableOpacity>
                <AntDesign
                  name="close"
                  size={24}
                  color={Colors.iconPrimary}
                  style={dynamicStyles.close}
                  onPress={() => setShowLockedModal(false)}
                />
              </TouchableOpacity>
              <CustomInput
                placeholder="Enter password"
                color={Colors.placeholder}
                value={unlockValue.password}
                onChangeText={(text: string) =>
                  setUnlockValue((p) => ({ ...p, password: text }))
                }
                isPassword
              />

              <Text style={dynamicStyles.timeText}>Unlock for minutes</Text>

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
                    <Text
                      style={[
                        dynamicStyles.time,
                        unlockValue.unlockMinutes === min &&
                          dynamicStyles.textActive,
                      ]}
                    >
                      {min}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleUnlock}
                style={dynamicStyles.pressable}
              >
                <Text style={dynamicStyles.pressableText}>Unlock</Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </View>
          <Toast />
        </Modal>
      )}
    </>
  );
}
