import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "flex-start",
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5a5a5aff",
    marginTop: 10,
    marginBottom: 7,
    textAlign: "center",
  },
  innerContainer: {
    alignItems: "center",
    margin: 10,
  },
  pressable: {
    backgroundColor: "#151cf8ff",
    padding: 15,
    margin: 15,
    borderRadius: 15,
    alignContent: "center",
  },

  pressableText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  continueText: {
    textAlign: "center",
    marginHorizontal: 10,
    color: "#707070ff",
    fontSize: 14,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#707070ff",
  },
  google: {
    padding: 15,
    margin: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#707070ff",
    backgroundColor: "#e6e4e4",
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
  },
  googleText: {
    fontWeight: "700",
    fontSize: 18,
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
