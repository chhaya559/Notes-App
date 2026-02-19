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

type props = {
  onClose: () => void;
  id: string;
  data?: string;
};
export default function Summary({ onClose, id, data }: Readonly<props>) {
  const { dynamicStyles } = useStyles(styles);
  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.headingContainer}>
        <Pressable style={dynamicStyles.icon}>
          <Ionicons
            name="sparkles-outline"
            size={26}
            style={{ alignItems: "center" }}
            color="#5757f8"
          />
        </Pressable>
        <Text style={dynamicStyles.heading}>AI Generated Summary</Text>
      </View>
      {data == null && <ActivityIndicator size="large" color="#5757f8" />}
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.contentText}>{data}</Text>
      </View>
      <TouchableOpacity style={dynamicStyles.close}>
        <AntDesign name="close" size={22} onPress={onClose} color="#5757f8" />
      </TouchableOpacity>
    </View>
  );
}
