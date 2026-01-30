import { Image, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

export default function DashboardHeader() {
  const navigation = useNavigation();
  return (
    <View>
      <Pressable onPress={() => navigation.navigate("Profile" as never)}>
        <Image
          source={require("../../../../assets/avatar.png")}
          style={styles.image}
        />
      </Pressable>
    </View>
  );
}
