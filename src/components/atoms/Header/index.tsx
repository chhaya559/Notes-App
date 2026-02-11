import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

export default function Header({
  navigation,
  back,
  options,
}: Readonly<NativeStackHeaderProps>) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {options.headerLeft
          ? options.headerLeft({})
          : back && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={30}
                  color="#5757f8"
                  style={{ padding: 5 }}
                />
              </TouchableOpacity>
            )}
      </View>
      <Text style={styles.title}>{options?.title}</Text>
      <View style={styles.right}>{options.headerRight?.({})}</View>
    </View>
  );
}
