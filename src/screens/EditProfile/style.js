import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    margin: 10,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    color: "#272727ff",
    marginTop: 20,
  },
  pressable: {
    backgroundColor: "#5757f8",
    padding: 15,
    margin: 15,
    borderRadius: 15,
    marginTop: 25,
  },
  pressableText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
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
