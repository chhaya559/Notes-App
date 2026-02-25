import { MaterialCommunityIcons } from "@expo/vector-icons";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
import styles from "@screens/Dashboard/styles";
import { Text, View } from "react-native";

type props = {
  isSearching: boolean;
  debouncedSearch: string;
};
export default function EmptyListComponent({
  isSearching,
  debouncedSearch,
}: Readonly<props>) {
  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();
  if (isSearching) {
    return (
      <View style={dynamicStyles.emptyContainer}>
        <Text style={dynamicStyles.emptyText}>
          No results for “{debouncedSearch.trim()}”
        </Text>
        <Text style={dynamicStyles.emptySecondaryText}>
          Try a different keyword
        </Text>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.emptyContainer}>
      <MaterialCommunityIcons
        name="note-multiple-outline"
        size={60}
        color={Colors.iconPrimary}
        style={{ alignSelf: "center", paddingBottom: 10 }}
      />
      <Text style={dynamicStyles.emptyText}>No notes yet</Text>
      <Text style={dynamicStyles.emptySecondaryText}>
        Tap the + button to write your first thought or idea
      </Text>
    </View>
  );
}
