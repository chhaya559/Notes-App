import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    paddingTop: 50,
    justifyContent: "space-between",
    padding: 15,
    paddingBottom: 0,
  },
  left: {
    flexDirection: "row",
    gap: 8,
  },
  right: {},
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: -35,
  },
  headerButton: {
    backgroundColor: "#E0E7FF",
    borderRadius: 50,
    marginTop: 0,
    justifyContent: "center",
    verticalAlign: "middle",
  },
});

export default styles;
