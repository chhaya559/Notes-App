import { Text, View } from "react-native";
import styles from "./styles";
import Color from "../../atoms/Color";
type Props = {
  selectedColor: string;
  onSelectColor: (color: string) => void;
};
export default function BackgroundColor({
  selectedColor,
  onSelectColor,
}: Readonly<Props>) {
  const colors: string[] = [
    "#F5F0FF",
    "#FFF0F5",
    "#F0FFF0",
    "#f9f8e0",
    "#F0F8FF",
    "#e6e6e6",
    "#d2eefa",
    "#ffe3f1",
    "#fffbdb",
    "#FFEFE6",
  ];

  return (
    <View style={styles.backgroundContainer}>
      <Text style={styles.text}>Background Color</Text>
      <View style={styles.backgroundOptionsContainer}>
        {colors.map((color, index) => (
          <Color
            key={index.toString()}
            background={color}
            focused={selectedColor === color}
            onPress={() => onSelectColor(color)}
          />
        ))}
      </View>
    </View>
  );
}
