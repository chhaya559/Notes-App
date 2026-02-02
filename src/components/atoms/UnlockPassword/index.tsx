import { Text, TouchableOpacity, View } from "react-native";
import CustomInput from "../CustomInput";

export default function UnlockPassword() {
  return (
    <View>
      <Text>Unlock your Note</Text>
      <View>
        <Text>Password</Text>
        <CustomInput placeholder="Enter password to unlock" />
      </View>
      <TouchableOpacity>
        <Text>Unlock Password</Text>
      </TouchableOpacity>
    </View>
  );
}
