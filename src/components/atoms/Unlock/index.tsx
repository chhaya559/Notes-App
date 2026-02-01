import { Text, TouchableOpacity, View } from "react-native";
import CustomInput from "../CustomInput";

export default function Unlock() {
  return (
    <View>
      <Text>Unlock your Note</Text>
      <CustomInput placeholder="Enter password to unlock" />
      <TouchableOpacity>
        <Text>Unlock Note</Text>
      </TouchableOpacity>
    </View>
  );
}
