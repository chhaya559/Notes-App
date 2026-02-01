import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Color from "../../atoms/Color";
import { useState } from "react";
 type Props = {
    selectedColor : string,
    onSelectColor :(color:string) =>void
  }
export default function BackgroundColor({selectedColor,onSelectColor}:Props) {

  const colors: string[] = [
    "#F5F0FF",
    "#FFF0F5",
    "#F0FFF0",
    "#f9f8e0",
    "#F0F8FF",
    "#f4f4f4",
    "#97dffa",
    "#fdc4e7",
    "#f9feb2",
    "#f5c2c2",
  ];
 
  return (
    <View style={styles.backgroundContainer}>
      <Text style={styles.text}>Background Color</Text>
      <View style={styles.backgroundOptionsContainer}>
        {colors.map((color, index) => (
          <Color
            key={index}
            background={color}
            focused={selectedColor === color}
            onPress={() => onSelectColor(color)}
          />
        ))}
      </View>
    </View>
  );
}
