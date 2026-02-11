import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    margin: 30,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#bfbfbfff",
    shadowOpacity: "0.2",
    borderRadius: 20,
    padding: 20,
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },
  wrap: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  iconWrap: {
    backgroundColor: "#e4e4e4",
    borderRadius: 25,
    padding: 4,
  },
  text: {
    textAlign: "center",
    justifyContent: "center",
    fontSize: 15,
  },
  line: {
    height: 1,
    backgroundColor: "#e4e4e4",
  },
  actionIcon: {
    backgroundColor: "#e4e4e4",
    borderRadius: 25,
    padding: 8,
  },
});

export default styles;
