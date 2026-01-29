import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  upperContainer: {
    flexDirection: "row",
  },
  editorContainer: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 8,
    flex: 1,
  },
  pressables: {
    backgroundColor: "#5757f8",
    padding: 10,
    borderRadius: 30,
  },
  line: {
    height: 1,
    backgroundColor: "#575757ff",
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    margin: 10,
  },
  body: {},
  pressablesText: {
    color: "#fff",
  },
  all: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 20,
    borderColor: "#8e8e8eff",
    borderWidth: 1,
    padding: 5,
    margin: 10,
    borderRadius: 10,
    position: "absolute",
    alignSelf: "center",
    paddingLeft: 20,
    paddingRight: 20,
    bottom: 30,
  },
  button: {
    borderWidth: 1,
    borderColor: "#8e8e8eff",
    borderRadius: 10,
    width: 40,
    backgroundColor: "#d2cfcfff",
  },
  input: {
    margin: 10,
    height: "100%",
    color: "#000",
  },
  bold: {
    fontWeight: "800",
  },
  italic: {
    fontStyle: "italic",
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
  },
  content: {
    backgroundColor: "#000",
    height: 600,
  },
});

export default styles;
