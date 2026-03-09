import useTheme from "@hooks/useTheme";
import { ActivityIndicator, View } from "react-native";

type Props = {
  isFetching: boolean;
  page: number;
};

export default function ListFooterComponent({
  isFetching,
  page,
}: Readonly<Props>) {
  const { Colors } = useTheme();

  if (!isFetching || page === 1) return null;

  return (
    <View
      style={{
        paddingVertical: 20,
      }}
    >
      <ActivityIndicator size="small" color={Colors.primary} />
    </View>
  );
}
