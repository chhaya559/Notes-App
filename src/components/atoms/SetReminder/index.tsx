import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import Modal from "react-native-modal";

export default function SetReminder() {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <Modal isVisible={isModalVisible} backdropOpacity={0.8}>
      <View>
        <Text>Set Reminder</Text>
      </View>
      <TouchableOpacity onPress={() => setIsModalVisible(false)}>
        <Entypo name="cross" size={26} color="#5757f8" />
      </TouchableOpacity>
    </Modal>
  );
}
