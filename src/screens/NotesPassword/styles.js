import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: "#5757f8",
    padding: 10,
    borderRadius: 10,
    margin: 15,
  },
  pressableText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  container: {
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
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

export default styles;
