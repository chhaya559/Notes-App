import { RootState } from "@redux/store";
import { Image, Text, View } from "react-native";
import { useSelector } from "react-redux";
import styles from "./styles";

export default function DashboardLeftHeader() {
  const user = useSelector((state: RootState) => state.auth.firstName);

  return (
    <View style={styles.headerLeft}>
      <View style={styles.iconWrap}>
        <Image
          source={require("../../../../assets/notes.png")}
          style={styles.image}
        />
      </View>
      <Text style={styles.text}>{(user ?? "Guest") + "'s Notes"}</Text>
    </View>
  );
}
