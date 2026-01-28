import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Card(props: any) {
  const navigation = useNavigation<any>();
  function handlePress() {
    navigation.navigate("CreateNote", {
      title: props.title,
      content: props.content,
      id: props.id,
    });
  }
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.heading}>{props.title}</Text>
      <Text style={styles.text}>{props.content}</Text>
      <View style={styles.createdContainer}>
        <Feather name="calendar" size={16} />
        <Text style={styles.created}>less than a min ago</Text>
      </View>
    </TouchableOpacity>
  );
}
