import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 5,
  },
  upperContainer: {
    flexDirection: "row",
  },
  editorContainer: {
    paddingBottom: 8,
    flex: 1,
    backgroundColor: "transparent",
    padding: 0,
  },
  pressables: {
    backgroundColor: "#5757f8",
    padding: 10,
    borderRadius: 30,
  },
  line: {
    height: 1,
    backgroundColor: "rgb(215, 212, 212)",
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    margin: 10,
    borderColor: "#6e6e6eff",
    borderBottomWidth: 1,
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
    backgroundColor: "#E0E7FF",
    borderRadius: 50,
    padding: 5,
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
    padding: 5,
    elevation: 5,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-around",
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 25,
    //elevation: 5,
  },
  optionButton: {
    padding: 5,
    backgroundColor: "#E0E7FF",
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
    padding: 12,
    paddingBottom: 0,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  touchables: {
    flexDirection: "row",
    gap: 5,
    padding: 5,
  },
  touchableText: {
    textAlign: "center",
    alignSelf: "center",
  },
  toolbar: {
    backgroundColor: "#fff",
  },
  attachmentOptions: {
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
    marginLeft: 15,
  },
  attachment: {
    flexDirection: "row",
    backgroundColor: "#E0E7FF",
    padding: 10,
    borderRadius: 10,
    width: 45,
    alignContent: "center",
  },
  close: {
    position: "absolute",
    right: 4,
    top: 5,
    backgroundColor: "#fefefeff",
    padding: 3,
    borderRadius: 10,
  },
  imageSize: {
    fontSize: 10,
    color: "#666",
  },
  fileContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#E0E7FF",
  },
  existingFile: {
    padding: 8,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#DDE3FF",
    height: 50,
  },
});

export default styles;
