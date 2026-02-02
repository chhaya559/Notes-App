import { Image, Pressable, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { FontAwesome } from "@expo/vector-icons";

export default function DashboardHeader() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile" as never)}
        style={styles.image}
      >
        <FontAwesome name="user-circle" color="#5757f8" size={34} />
      </TouchableOpacity>
    </View>
  );
}
