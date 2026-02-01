import { Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { AntDesign, Ionicons } from "@expo/vector-icons";

type props = {
  onClose: () => void;
};
export default function AISummary({ onClose }: props) {
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Pressable style={styles.icon}>
          <Ionicons name="sparkles-outline" size={24} style={{}} />
        </Pressable>
        <Text style={styles.heading}>AI Generated Summary</Text>
        <View style={styles.content}></View>
      </View>
      <TouchableOpacity style={styles.close}>
        <AntDesign name="close" size={24} onPress={onClose} />
      </TouchableOpacity>
    </View>
  );
}
