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
  data?: string | null;
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <View
          style={[
            dynamicStyles.content,
            { alignItems: "center", justifyContent: "center", minHeight: 80 },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.iconPrimary} />
          <Text
            style={[
              dynamicStyles.contentText,
              { marginTop: 12, opacity: 0.6, textAlign: "center" },
            ]}
          >
            Generating summary…
          </Text>
        </View>
      );
    }

    if (!data) {
      return (
        <View
          style={[
            dynamicStyles.content,
            { alignItems: "center", justifyContent: "center", minHeight: 80 },
          ]}
        >
          <Text
            style={[
              dynamicStyles.contentText,
              { opacity: 0.5, textAlign: "center" },
            ]}
          >
            No summary available.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={dynamicStyles.content} bounces={false}>
        <Text style={dynamicStyles.contentText}>{data}</Text>
      </ScrollView>
    );
  };

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

      {renderContent()}
    </View>
  );
}
