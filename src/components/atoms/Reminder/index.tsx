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
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";

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
  const { dynamicStyles } = useStyles(styles);
  const [description, setDescription] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    if (ReminderData?.data) {
      const remindAt = new Date(ReminderData.data.remindAt);
      const now = new Date();
      console.log(remindAt.toISOString(), "fjkfk");

      if (remindAt < now) {
        setIsEditMode(false);
        setDate(null);
        setName("");
        setDescription("");
      } else {
        setIsEditMode(true);
        setDate(remindAt);
        setName(ReminderData?.data?.title ?? "");
        setDescription(ReminderData?.data?.description ?? "");
      }
    } else {
      setIsEditMode(false);
      setDate(null);
      setName("");
      setDescription("");
    }
  }, [ReminderData]);

  const formattedDate = date ? date.toLocaleString() : "";

  async function setReminder() {
    try {
      if (!date) {
        Toast.show({ text1: "Please select date & time" });
        return;
      }

      const utcISOString = new Date(date).toISOString();

      await setReminderApi({
        noteId: id,
        title: name,
        description,
        remindAt: utcISOString,
      }).unwrap();
      Toast.show({ text1: "Reminder set successfully" });
      onReminderSet(id);
      onClose();
      navigation.setParams({ reminderSet: true });
    } catch (error: any) {
      console.log(error);
      Toast.show({
        text1: error?.data?.message || "Failed to set reminder",
      });
    }
  }

  async function handleDelete() {
    try {
      const response = await deleteApi(id).unwrap();
      console.log(response, "delete response");
      Toast.show({ text1: "Reminder deleted" });
      onClose();
    } catch (error) {
      Toast.show({ text1: "Failed to delete reminder" });
      console.log("error deleting reminder", error);
    }
  }
  const { Colors } = useTheme();
  return (
    <Modal isVisible={true}>
      <View style={dynamicStyles.container}>
        <KeyboardAwareScrollView bounces={false}>
          <View style={dynamicStyles.headingContainer}>
            <View style={dynamicStyles.iconBackground}>
              <Ionicons color={Colors.icon} size={24} name="notifications" />
            </View>
            <Text style={dynamicStyles.headingText}>Set Reminder</Text>
          </View>

          <View style={dynamicStyles.line} />

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

          <View style={dynamicStyles.contentView}>
            <Text style={dynamicStyles.textInput}>Name*</Text>
            <TextInput
              value={name}
              placeholder="Name of Reminder"
              onChangeText={setName}
              placeholderTextColor={Colors.placeholder}
              style={dynamicStyles.input}
            />

            <Text style={dynamicStyles.textInput}>Description</Text>
            <TextInput
              style={dynamicStyles.input}
              placeholderTextColor={Colors.placeholder}
              value={description}
              placeholder="Description for your reminder"
              onChangeText={setDescription}
            />

            <Text style={dynamicStyles.textInput}>Date & Time</Text>

            <TouchableOpacity onPress={() => setOpenDateModal(true)}>
              <TextInput
                pointerEvents="none"
                editable={false}
                placeholder="Select date & time"
                placeholderTextColor={Colors.placeholder}
                value={formattedDate}
                style={[
                  dynamicStyles.input,
                  isFocused && dynamicStyles.focused,
                ]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={dynamicStyles.calendar}
              onPress={() => setOpenDateModal(true)}
            >
              {/* <EvilIcons name="calendar" size={26} color={Colors.icon} /> */}
            </TouchableOpacity>
          </View>

          <View style={dynamicStyles.line} />

          <TouchableOpacity
            style={[
              dynamicStyles.pressable,
              (!date || isLoading) && { opacity: 0.6 },
            ]}
            disabled={!date || isLoading}
            onPress={setReminder}
          >
            <Text style={dynamicStyles.setText}>
              {isLoading ? "Setting..." : "Set Reminder"}
            </Text>
          </TouchableOpacity>

          {isEditMode && (
            <TouchableOpacity
              style={dynamicStyles.pressable}
              onPress={handleDelete}
            >
              <Text style={dynamicStyles.setText}>Delete Reminder</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={dynamicStyles.close} onPress={onClose}>
            <AntDesign name="close" size={22} color={Colors.icon} />
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}
