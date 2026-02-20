import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";

type props = {
  onClose: () => void;
  id: string;
  data?: string;
};
export default function Summary({ onClose, id, data }: Readonly<props>) {
  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();
  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.headingContainer}>
        <Pressable style={dynamicStyles.icon}>
          <Ionicons
            name="sparkles-outline"
            size={26}
            style={{ alignItems: "center" }}
            color={Colors.icon}
          />
        </Pressable>
        <Text style={dynamicStyles.heading}>AI Generated Summary</Text>
      </View>
      {data == null && <ActivityIndicator size="large" color={Colors.icon} />}
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.contentText}>{data}</Text>
      </View>
      <TouchableOpacity style={dynamicStyles.close}>
        <AntDesign
          name="close"
          size={22}
          onPress={onClose}
          color={Colors.icon}
        />
      </TouchableOpacity>
    </View>
  );
}
