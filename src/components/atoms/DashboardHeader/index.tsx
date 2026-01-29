import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, View } from "react-native";
import styles from "../../../screens/Dashboard/styles";
import { useNavigation } from "@react-navigation/native";

export default function DashboardHeader() {
  const navigation = useNavigation();
  return (
    <View style={styles.innerContainer}>
      {/* <MaterialIcons name="notifications" size={26} /> */}

      {/* <Pressable>
        <MaterialIcons name="light-mode" size={26} />
      </Pressable> */}

      <Pressable onPress={() => navigation.navigate("Profile" as never)}>
        <Image
          source={require("../../../../assets/avatar.png")}
          style={styles.image}
        />
      </Pressable>
    </View>
  );
}
