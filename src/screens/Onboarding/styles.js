import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",

    // borderWidth: 10,
  },
  image: {
    height: 120,
    width: 120,
    marginTop: 50,
    borderRadius: 20,
  },
  name: {
    margin: 15,
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 25,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
  },
  guest: {
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    borderColor: "#5157f8",
    borderWidth: 1,
  },
  guestText: {
    color: "#5157f8",
    fontSize: 20,
    textAlign: "center",
    alignItems: "center",
  },
  create: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#5157F8",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  createText: {
    fontSize: 20,
    textAlign: "center",
    color: "#5157F8",
  },
  signin: {
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#5157F8",
    alignItems: "center",
    width: "100%",
  },
  signinText: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
  },
  innerContainer: {
    marginTop: 50,
    margin: 20,
    gap: 10,
  },
  container: {
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    marginTop: 50,
    alignSelf: "center",
    fontSize: 15,
  },
  ai: {
    backgroundColor: "#d1d1f9d0",
    padding: 15,
    color: "#5157F8",
    borderRadius: 20,
    fontSize: 20,
    marginTop: 20,
    paddingHorizontal: 40,
  },
});

export default styles;
