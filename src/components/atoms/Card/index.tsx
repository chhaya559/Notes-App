import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import CustomInput from "../CustomInput";
import Modal from "react-native-modal";
import { useUnlockNoteMutation } from "@redux/api/noteApi";
import Toast from "react-native-toast-message";

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
export default function Card(props: any) {
  const navigation = useNavigation<any>();
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [unlockApi] = useUnlockNoteMutation();
  const [isVisible, setIsVisible] = useState(false);
  const [unlockValue, setUnlockValue] = useState<{
    password: string;
    unlockMinutes: number | null;
  }>({
    password: "",
    unlockMinutes: null,
  });
  const [unlockUntil, setUnlockUntil] = useState<number | null>(null);

  async function handleUnlock() {
    try {
      if (!unlockValue.unlockMinutes || !unlockValue.password) {
        Toast.show({ text1: "Enter password and select time" });
        return;
      }

      const response: any = await unlockApi({
        id: props.id,
        password: unlockValue.password,
        unlockMinutes: unlockValue.unlockMinutes,
      });

      if (response?.data?.success) {
        const unlockUntil = Date.now() + unlockValue.unlockMinutes * 60 * 1000;
        setUnlockUntil(unlockUntil);
        setShowLockedModal(false);

        navigation.navigate("CreateNote", {
          id: props.id,
          unlockUntil,
        });
      } else {
        Toast.show({ text1: "Wrong password" });
      }
    } catch (error) {
      console.log(error);
      Toast.show({ text1: "Unlock failed" });
    }
  }

  function handlePress() {
    const now = Date.now();

    if (unlockUntil && unlockUntil > now) {
      navigation.navigate("CreateNote", { id: props.id, unlockUntil });
      return;
    }

    if (props.isPasswordProtected) {
      setShowLockedModal(true);
      return;
    }
    navigation.navigate("CreateNote", { id: props.id });
  }

  return (
    <>
      {showLockedModal && (
        <Modal
          isVisible={showLockedModal}
          backdropOpacity={0.5}
          style={styles.modal}
        >
          <Text style={styles.unlockHeading}>Unlock your Note</Text>
          <CustomInput
            placeholder="Enter password to unlock"
            value={unlockValue.password}
            onChangeText={(text: string) =>
              setUnlockValue((prev) => ({ ...prev, password: text }))
            }
            isPassword
            isVisible={isVisible}
            onToggleVisibility={() => {
              setIsVisible((prev) => !prev);
            }}
            secureTextEntry={!isVisible}
          />
          <Text style={styles.timeText}>Unlock Note for Selected Time</Text>
          <View style={styles.counter}>
            {[5, 10, 20, 30, 50].map((min) => (
              <TouchableOpacity
                key={min}
                style={[
                  styles.counterTime,
                  unlockValue.unlockMinutes === min && styles.counterActive,
                ]}
                onPress={() =>
                  setUnlockValue((prev) => ({ ...prev, unlockMinutes: min }))
                }
              >
                <Text style={styles.time}>{min}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleUnlock} style={[styles.pressable]}>
            <Text style={styles.pressableText}>Unlock </Text>
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
            {props.isPasswordProtected ? (
              <TouchableOpacity style={styles.lock}>
                <Feather name="lock" size={24} />
              </TouchableOpacity>
            ) : null}
            {props.isReminderSet ? (
              <TouchableOpacity style={styles.clock}>
                <Feather name="clock" size={24} />
              </TouchableOpacity>
            ) : null}
          </View>
        </TouchableOpacity>
        {/* <View style={styles.iconsWrap}>
            {props.isPasswordProtected ? (
              <TouchableOpacity style={styles.icon}>
                <Feather name="lock" size={24} />
              </TouchableOpacity>
            ) : null}
            {props.isReminderSet ? (
              <TouchableOpacity>
                <Feather name="clock" size={24} />
              </TouchableOpacity>
            ) : null}
          </View> */}
      </View>
    </>
  );
}
