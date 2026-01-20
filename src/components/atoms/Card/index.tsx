import { View, Text } from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";

export default function Card() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Heading</Text>
      <Text style={styles.text}>
        This is your first note! You can create,edit, and organize notes with
        ease ...
      </Text>
      <View style={styles.createdContainer}>
        <Feather name="calendar" size={20} />
        <Text style={styles.created}>less than a min ago</Text>
      </View>
    </View>
  );
}
