import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    margin: 15,
    marginBottom: 5,
    gap: 5,
  },
  label: {
    fontWeight: "medium",
    fontSize: 17,
  },
  input: {
    borderWidth: 1,
    borderColor: "#707070ff",
    padding: 12,
    borderRadius: 10,
    color: "#000000ff",
  },
  focused: {
    borderColor: "#494949ff",
    borderWidth: 2,
  },
  passwordWrapper: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    right: 12,
    top: 10,
  },
});

export default styles;
