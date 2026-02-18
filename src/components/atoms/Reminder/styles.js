import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    padding: 15,
  },
  headingContainer: {
    flexDirection: "row",
    gap: 10,
    paddingBottom: 10,
    paddingTop: 8,
  },
  line: {
    height: 1,
    borderColor: "#e4e6e6",
    width: "100%",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  headingText: {
    textAlign: "center",
    color: "#5757f8",
    fontWeight: "bold",
    fontSize: 20,
    verticalAlign: "middle",
    textAlignVertical: "center",
    marginTop: 3,
  },
  contentView: {
    padding: 10,
    marginLeft: 0,
    marginRight: 0,
  },
  close: {
    position: "absolute",
    right: 18,
    top: 13,
  },
  pressable: {
    margin: 10,
    backgroundColor: "#5757f8",
    borderRadius: 10,
    marginTop: 20,
    padding: 4,
    shadowColor: "#1029e4ff",
    shadowOpacity: 0.4,
  },
  setText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "400",
    padding: 10,
    textAlign: "center",
  },
  calendar: {
    position: "absolute",
    top: 193,
    right: 25,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#bfbebeff",
    padding: 10,
    marginTop: 3,
    marginBottom: 2,
  },
  focused: {
    borderWidth: 2,
    borderColor: "#000",
  },

  textInput: {
    margin: 3,
    fontSize: 15,
  },
  iconBackground: {
    backgroundColor: "#E0E7FF",
    padding: 3,
    borderRadius: 25,
  },
});

export default styles;
