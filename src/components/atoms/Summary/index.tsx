import {
  ActivityIndicator,
  Pressable,
  ScrollView,
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
  isLoading?: boolean;
};
export default function Summary({
  onClose,
  id,
  data,
  isLoading,
}: Readonly<props>) {
  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();
  if (isLoading) {
    return <ActivityIndicator size="large" color={Colors.iconPrimary} />;
  }
  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.headingContainer}>
        <Pressable style={dynamicStyles.icon}>
          <Ionicons
            name="sparkles-outline"
            size={24}
            style={{ alignItems: "center" }}
            color={Colors.iconPrimary}
          />
        </Pressable>
        <Text style={dynamicStyles.heading}>AI Generated Summary</Text>
        <TouchableOpacity style={dynamicStyles.close}>
          <AntDesign
            name="close"
            size={22}
            onPress={onClose}
            color={Colors.iconPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={dynamicStyles.content} bounces={false}>
        <Text style={dynamicStyles.contentText}>{data}</Text>
      </ScrollView>
    </View>
  );
}
