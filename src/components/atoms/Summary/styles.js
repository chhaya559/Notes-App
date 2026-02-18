import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cdcdcdff",
    padding: 20,
    alignItems: "center",
    margin: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  headingContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  icon: {},
  heading: {
    color: "#5757f8",
    fontSize: 18,
    fontWeight: "700",
  },
  close: {
    position: "absolute",
    right: 15,
    top: 10,
  },
  content: {
    backgroundColor: "#bebeebff",
    borderRadius: 10,
    padding: 10,
  },
  contentText: {
    fontSize: 16,
  },
});

export default styles;
