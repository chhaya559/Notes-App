import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { AntDesign, Ionicons } from "@expo/vector-icons";

type props = {
  onClose: () => void;
  id: string;
  data?: string;
};
export default function Summary({ onClose, id, data }: Readonly<props>) {
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Pressable style={styles.icon}>
          <Ionicons
            name="sparkles-outline"
            size={26}
            style={{ alignItems: "center" }}
            color="#5757f8"
          />
        </Pressable>
        <Text style={styles.heading}>AI Generated Summary</Text>
      </View>
      {data == null && <ActivityIndicator size="large" color="#5757f8" />}
      <View style={styles.content}>
        <Text style={styles.contentText}>{data}</Text>
      </View>
      <TouchableOpacity style={styles.close}>
        <AntDesign name="close" size={22} onPress={onClose} color="#5757f8" />
      </TouchableOpacity>
    </View>
  );
}
