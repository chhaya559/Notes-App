import { Pressable, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useState } from "react";

type Props = {
  background: string;
  focused : boolean;
  onPress: () => void;
};
export default function BackgroundColor({ background,focused,onPress }: Props) {
  return (
    <Pressable style={styles.backgroundOptions} onPress={onPress}>
      <View
        style={[
          styles.backgroundOptionsView,
          { backgroundColor: background },
          focused && styles.focused,
        ]}
      ></View>
    </Pressable>
  );
}
