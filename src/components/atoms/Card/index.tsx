import { View, Text, TouchableOpacity, Pressable } from "react-native";
import styles from "./styles";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import CustomInput from "../CustomInput";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setNotesUnlocked, lockNotes } from "@redux/slice/authSlice";
import { useUnlockNoteMutation } from "@redux/api/noteApi";

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

  const { isNotesUnlocked, notesUnlockUntil } = useSelector(
    (state: RootState) => state.auth,
  );

  const [unlockNote] = useUnlockNoteMutation();

  const [showLockedModal, setShowLockedModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

  function handlePress() {
    if (props.isLocked && !isNotesUnlocked) {
      setShowLockedModal(true);
      return;
    }

    navigation.navigate("CreateNote", { id: props.id });
  }

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
            secureTextEntry={!isVisible}
            isVisible={isVisible}
            onToggleVisibility={() => setIsVisible((p) => !p)}
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

      <TouchableOpacity
        style={[styles.container, { backgroundColor: props.backgroundColor }]}
        onPress={handlePress}
      >
        <Text style={styles.heading}>{props.title}</Text>

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
      </TouchableOpacity>
    </>
  );
}
