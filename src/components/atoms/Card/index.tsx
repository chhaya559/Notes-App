import { View, Text, TouchableOpacity, Pressable } from "react-native";
import styles from "./styles";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import CustomInput from "../CustomInput";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setNotesUnlocked, lockNotes } from "@redux/slice/authSlice";
import { useDeleteMutation, useUnlockNoteMutation } from "@redux/api/noteApi";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { db } from "src/db/notes";
import { notesTable } from "src/db/schema";
import { and, eq } from "drizzle-orm";
import { useNetInfo } from "@react-native-community/netinfo";
import { runOnJS } from "react-native-worklets";
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
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
  const { isNotesUnlocked, notesUnlockUntil } = useSelector(
    (state: RootState) => state.auth,
  );

  const [unlockNote] = useUnlockNoteMutation();
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const [showLockedModal, setShowLockedModal] = useState(false);

  const [unlockValue, setUnlockValue] = useState<{
    password: string;
    unlockMinutes: number | null;
  }>({
    password: "",
    unlockMinutes: null,
  });

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

      if (!res?.success) {
        Toast.show({ text1: "Wrong password" });
        return;
      }

      const unlockUntil = Date.now() + unlockValue.unlockMinutes * 60 * 1000;

      dispatch(setNotesUnlocked({ unlockUntil }));

      setShowLockedModal(false);

      navigation.navigate("CreateNote", { id: props.id });
    } catch {
      Toast.show({ text1: "Unlock failed" });
    }
  }
  async function handleDelete() {
    try {
      await db
        .delete(notesTable)
        .where(and(eq(notesTable.id, props.id), eq(notesTable.userId, userId)));
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
    if (props.isLocked && !isNotesUnlocked) {
      setShowLockedModal(true);
      return;
    }

    navigation.navigate("CreateNote", { id: props.id });
  }

  const offset = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        offset.value = event.translationX;
      }
    })
    .onEnd(() => {
      if (offset.value < 100) {
        runOnJS(handleDelete)();
      } else {
        offset.value = 0;
      }
    });

  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });
  return (
    <>
      {showLockedModal && (
        <Modal isVisible backdropOpacity={0.5} style={styles.modal}>
          <Text style={styles.unlockHeading}>Unlock Notes</Text>

          <CustomInput
            placeholder="Enter password"
            value={unlockValue.password}
            onChangeText={(text: string) =>
              setUnlockValue((p) => ({ ...p, password: text }))
            }
            isPassword
            // secureTextEntry={!isVisible}
            // isVisible={isVisible}
            // onToggleVisibility={() => setIsVisible((p) => !p)}
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

          <AntDesign
            name="close"
            size={24}
            color="#5757f8"
            style={styles.close}
            onPress={() => setShowLockedModal(false)}
          />
        </Modal>
      )}
      <View>
        <View style={styles.delete}>
          <MaterialIcons name="delete" size={24} color="black" />
        </View>
        <GestureDetector gesture={pan}>
          <AnimatedTouchableOpacity
            style={[
              styles.container,
              { backgroundColor: props.backgroundColor },
              sliderStyle,
            ]}
            onPress={handlePress}
          >
            <Text style={styles.heading}>{props.title.substring(0, 25)}</Text>

            <View style={styles.createdContainer}>
              <Feather name="calendar" size={16} />
              <Text style={styles.created}>{formatDate(props.updatedAt)}</Text>
            </View>

            <View style={styles.iconsWrap}>
              {props.isLocked ? (
                <Pressable style={styles.icon}>
                  <Feather name="lock" size={24} color="#ffffffff" />
                </Pressable>
              ) : null}
              {props.isReminderSet ? (
                <Pressable style={styles.icon}>
                  <Feather name="clock" size={24} color="#ffffffff" />
                </Pressable>
              ) : null}
            </View>
          </AnimatedTouchableOpacity>
        </GestureDetector>
      </View>
    </>
  );
}
