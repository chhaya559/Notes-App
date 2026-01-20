import { Pressable, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignContent: "flex-start",
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    margin: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "400",
    margin: 10,
    textAlign: "center",
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
  navigator: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    marginTop: 10,
  },
  backText: {
    fontSize: 16,
  },
  error: {
    textAlign: "left",
    flexDirection: "row",
    color: "#ff0000ff",
    gap: 6,
    marginLeft: 20,
    fontSize: 12,
    padding: 5,
    width: "a",
    alignSelf: "flex-start",
    borderRadius: 10,
  },
});

export default styles;
