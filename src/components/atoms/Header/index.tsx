import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TouchableOpacity, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./styles";

export default function Header({
  navigation,
  back,
  options,
}: NativeStackHeaderProps) {
  function handleBack() {
    if (back) {
      navigation.goBack();
    }
  }
  return (
    <View style={styles.header}>
      {back && (
        <TouchableOpacity onPress={handleBack}>
          <MaterialIcons
            name="keyboard-arrow-left"
            size={30}
            color="#000000ff"
          />
        </TouchableOpacity>
      )}
      <Text>{options?.title}</Text>
    </View>
  );
}
