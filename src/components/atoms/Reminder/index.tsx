import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";
import DatePicker from "react-native-date-picker";
import { useState } from "react";

type props = {
  onClose: () => void;
};
export default function Reminder({ onClose }: props) {
  const [date, setDate] = useState<Date | null>(null);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [focused, setIsFocused] = useState(false);

  const formattedDate = date ? date.toLocaleString() : "";

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Ionicons
          color="#5757f8"
          size={24}
          name="notifications-outline"
          style={{}}
        />
        <Text style={styles.headingText}>Set Reminder</Text>
      </View>
      {openDateModal && (
        <DatePicker
          modal
          open={openDateModal}
          date={date ?? new Date()}
          mode="datetime"
          onConfirm={(selectedDate) => {
            setOpenDateModal(false);
            setDate(selectedDate);
          }}
          onCancel={() => {
            setOpenDateModal(false);
          }}
        />
      )}
      <Text style={styles.date}>Date & Time</Text>
      <TextInput
        placeholder="Select date & time"
        placeholderTextColor="#e4e4e4"
        value={formattedDate}
        style={[styles.input, focused && styles.focused]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <TouchableOpacity
        style={styles.calendar}
        onPress={() => setOpenDateModal(true)}
      >
        <EvilIcons name="calendar" size={26} />
      </TouchableOpacity>
      <Pressable style={styles.pressable} disabled={!date}>
        <Text style={styles.setText}>Set Reminder</Text>
      </Pressable>
      <TouchableOpacity style={styles.close}>
        <AntDesign name="close" size={22} onPress={onClose} color="#5757f8" />
      </TouchableOpacity>
    </View>
  );
}
