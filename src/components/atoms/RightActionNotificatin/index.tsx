import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "@hooks/useTheme";
import { TouchableOpacity } from "react-native";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type RightActionProps = {
  translation: SharedValue<number>;
  item: any;
  deleteNotification: (id: string) => void;
  dynamicStyles: any;
};

export default function RightAction({
  translation,
  item,
  deleteNotification,
  dynamicStyles,
}: Readonly<RightActionProps>) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translation.value + 80 }],
    };
  });
  const { Colors } = useTheme();

  return (
    <Reanimated.View style={[animatedStyle, dynamicStyles.swipe]}>
      <TouchableOpacity onPress={() => deleteNotification(item.id)}>
        <MaterialIcons
          name="delete-outline"
          size={38}
          color={Colors.danger}
          style={dynamicStyles.delete}
        />
      </TouchableOpacity>
    </Reanimated.View>
  );
}
