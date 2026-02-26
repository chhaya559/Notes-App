import { Entypo } from "@expo/vector-icons";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
import styles from "@screens/CreateNote/style";
import { TouchableOpacity, View } from "react-native";

type props = {
  handleSave: () => void;
};
export default function SaveNoteButton({ handleSave }: Readonly<props>) {
  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();
  return (
    <View style={dynamicStyles.header}>
      <TouchableOpacity onPress={() => handleSave()}>
        <Entypo
          name="check"
          size={30}
          color={Colors.iconPrimary}
          style={dynamicStyles.headerButton}
        />
      </TouchableOpacity>
    </View>
  );
}
