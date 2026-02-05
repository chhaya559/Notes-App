import { Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";
import DatePicker from "react-native-date-picker";
import { useEffect, useState } from "react";
import Modal from "react-native-modal";
import {
  useDeleteReminderMutation,
  useGetReminderByIdQuery,
  useSetReminderMutation,
} from "@redux/api/reminderApi";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

type Props = {
  onClose: () => void;
  id: string;
  onReminderSet: (noteId: string) => void;
};

export default function Reminder({
  onClose,
  id,
  onReminderSet,
}: Readonly<Props>) {
  const { data: ReminderData } = useGetReminderByIdQuery({ id });
  const [deleteApi] = useDeleteReminderMutation();
  const navigation = useNavigation<any>();
  const [date, setDate] = useState<Date | null>(null);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [setReminderApi, { isLoading }] = useSetReminderMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (ReminderData?.data?.remindAt) {
      setIsEditMode(true);
      //  const getDate = new Date(ReminderData.data.remindAt.toLocaleString());
      setDate(new Date(ReminderData.data.remindAt));
    } else {
      setDate(null);
    }
    setName(ReminderData?.data?.title ?? "");
    setDescription(ReminderData?.data?.description ?? "");
  }, [ReminderData]);

  const formattedDate = date ? date.toLocaleString() : "";

  async function setReminder() {
    try {
      if (!date) {
        Toast.show({ text1: "Please select date & time" });
        return;
      }

      const utcISOString = new Date(date).toISOString();

      const response = await setReminderApi({
        noteId: id,
        title: name,
        description,
        remindAt: utcISOString,
      }).unwrap();

      console.log("Reminder set response", response);

      Toast.show({ text1: "Reminder set successfully" });
      onReminderSet(id);
      onClose();
      navigation.setParams({ reminderSet: true });
    } catch (error: any) {
      console.log("error setting reminder", error);
      Toast.show({
        text1: error?.data?.message || "Failed to set reminder",
      });
    }
  }
  async function handleDelete() {
    try {
      await deleteApi(id);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Modal isVisible={true}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <View style={styles.iconBackground}>
            <Ionicons color="#5757f8" size={24} name="notifications" />
          </View>
          <Text style={styles.headingText}>Set Reminder</Text>
        </View>
        <View style={styles.line} />

        {openDateModal && (
          <DatePicker
            modal
            open={openDateModal}
            date={date ?? new Date()}
            mode="datetime"
            minimumDate={new Date()}
            onConfirm={(selectedDate) => {
              setOpenDateModal(false);
              setDate(selectedDate);
            }}
            onCancel={() => setOpenDateModal(false)}
          />
        )}

        <View style={styles.contentView}>
          <Text style={styles.textInput}>Name*</Text>
          <TextInput
            value={name}
            placeholder="Name of Reminder"
            onChangeText={setName}
            style={styles.input}
          />

          <Text style={styles.textInput}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            placeholder="Description for your reminder"
            onChangeText={setDescription}
          />
          <Text style={styles.textInput}>Date & Time</Text>

          <TouchableOpacity onPress={() => setOpenDateModal(true)}>
            <TextInput
              pointerEvents="none"
              editable={false}
              placeholder="Select date & time"
              value={formattedDate}
              style={[styles.input, isFocused && styles.focused]}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.calendar}
            onPress={() => setOpenDateModal(true)}
          >
            <EvilIcons name="calendar" size={26} />
          </TouchableOpacity>
        </View>
        <View style={styles.line} />

        <TouchableOpacity
          style={[styles.pressable, (!date || isLoading) && { opacity: 0.6 }]}
          disabled={!date || isLoading}
          onPress={setReminder}
        >
          <Text style={styles.setText}>
            {isLoading ? "Setting..." : "Set Reminder"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pressable]}
          disabled={isEditMode}
          onPress={handleDelete}
        >
          <Text style={styles.setText}>Delete Reminder</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.close} onPress={onClose}>
          <AntDesign name="close" size={22} color="#5757f8" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
