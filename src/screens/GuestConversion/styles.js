import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontWeight: "700",
    fontSize: 25,
    textAlign: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 18,
    padding: 10,
    fontWeight: "500",
  },
  pressable: {
    padding: 15,
    margin: 15,
    backgroundColor: "#5757f8",
    borderRadius: 10,
  },
  pressableText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  error: {
    textAlign: "left",
    flexDirection: "row",
    gap: 6,
    marginLeft: 20,
    fontSize: 12,
    padding: 5,
    width: "a",
    alignSelf: "flex-start",
    borderRadius: 10,
    color: "#ff0000ff",
  },
});

export default style;
