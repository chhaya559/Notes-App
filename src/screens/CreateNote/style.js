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
    backgroundColor: "#a8a3a3ff",
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
    backgroundColor: "#f5f5f5",
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
    height: "100%",
  },

  headerButton: {
    backgroundColor: "#e6e4e4ff",
    borderRadius: 50,
    padding: 4,
  },
  header: {
    flexDirection: "row",
    alignSelf: "baseline",
    gap: 20,
  },
  modal: {
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    padding: 15,
  },
  options: {
    backgroundColor: "#91a2dfff",
    flexDirection: "row",
    borderRadius: 50,
    justifyContent: "space-around",
    margin: 45,
    marginTop: 0,
    marginBottom: 5,
    padding: 7,
  },
  optionButton: {
    padding: 2,
    backgroundColor: "#e6e4e4",
    borderRadius: 25,
  },
  optionIcon: {
    color: "#5757f8",
    padding: 5,
  },
  headerMenu: {
    alignSelf: "flex-end",
    width: "auto",
    backgroundColor: "#fafafa",
    padding: 15,
    paddingBottom: 0,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  touchables: {
    flexDirection: "row",
    gap: 5,
    padding: 6,
  },
  touchableText: {
    textAlign: "center",
    alignSelf: "center",
  },
});

export default styles;
