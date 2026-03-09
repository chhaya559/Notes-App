import useStyles from "@hooks/useStyles";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import styles from "../Card/styles";
import { TouchableOpacity } from "react-native";
import useTheme from "@hooks/useTheme";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

type props = {
  translation: SharedValue<number>;
  confirmDelete: () => void;
  isPasswordProtected: boolean;
  unLockNote: () => void;
  lockNote: any;
};
export default function RightActionCard({
  translation,
  confirmDelete,
  isPasswordProtected,
  unLockNote,
  lockNote,
}: Readonly<props>) {
  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      translateX: translation.value + 145,
    };
  });

  return (
    <Animated.View style={[dynamicStyles.swipeAction, animatedStyle]}>
      <TouchableOpacity onPress={confirmDelete} style={dynamicStyles.deleteBg}>
        <MaterialIcons name="delete-outline" size={42} color={Colors.danger} />
      </TouchableOpacity>
      {isPasswordProtected ? (
        <TouchableOpacity onPress={unLockNote} style={dynamicStyles.lockBg}>
          <Entypo name="lock-open" size={42} color={Colors.iconPrimary} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={lockNote} style={dynamicStyles.lockBg}>
          <Entypo name="lock" size={42} color={Colors.iconPrimary} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
