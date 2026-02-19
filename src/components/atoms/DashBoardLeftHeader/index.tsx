import { RootState } from "@redux/store";
import { Image, Text, View } from "react-native";
import { useSelector } from "react-redux";
import styles from "./styles";
import useTheme from "@hooks/useTheme";
import useStyles from "@hooks/useStyles";

export default function DashboardLeftHeader() {
  const user = useSelector((state: RootState) => state.auth.firstName);
  const { toggleTheme, darkMode, Colors } = useTheme();
  const { dynamicStyles } = useStyles(styles);

  return (
    <View style={dynamicStyles.headerLeft}>
      <Text style={dynamicStyles.text}>Hello, {user ?? "Guest"} 👋</Text>
    </View>
  );
}
