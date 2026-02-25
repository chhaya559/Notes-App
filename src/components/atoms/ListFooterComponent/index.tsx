import useTheme from "@hooks/useTheme";
import { ActivityIndicator, View } from "react-native";

type props = {
  isFetching: boolean;
  page: number;
};
export default function ListFooterComponent({
  isFetching,
  page,
}: Readonly<props>) {
  const { Colors } = useTheme();

  return isFetching && page > 1 ? (
    <View style={{ padding: 20 }}>
      <ActivityIndicator size="small" color={Colors.primary} />
    </View>
  ) : (
    <View style={{ height: 0 }} />
  );
}
