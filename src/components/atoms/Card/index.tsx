import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RenderHtml from "react-native-render-html";

export default function Card(props: any) {
  const navigation = useNavigation<any>();
  function handlePress() {
    navigation.navigate("CreateNote", {
      title: props.title,
      content: props.content,
      id: props.id,
    });
  }
  function formatDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.heading}>{props.title}</Text>
      <View style={styles.text}>
        <RenderHtml source={props.content ?? null} />
      </View>
      <View style={styles.createdContainer}>
        <Feather name="calendar" size={16} />
        <Text style={styles.created}>{formatDate(props.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}
