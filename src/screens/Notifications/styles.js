import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    paddingTop: 30,
  },
  card: {
    backgroundColor: "#E0E7FF",
    padding: 15,
    borderRadius: 20,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  icon: {
    alignSelf: "center",
  },

  close: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modal: {
    padding: 15,
    borderRadius: 12,
    height: 200,
    backgroundColor: "#fefeffff",
    shadowColor: "#a0a0d9ff",
    shadowOpacity: 0.7,
  },

  pressable: {
    padding: 7,
    backgroundColor: "#5757f8",
    borderRadius: 20,
    marginTop: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    margin: 10,
  },
  message: {
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 8,
  },
  messageDescription: {
    textAlign: "center",
    fontWeight: "500",
    paddingTop: 10,
  },
  emptyComponent: {
    alignItems: "center",
  },
  noText: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 10,
  },
  emptyMessage: {
    fontWeight: "500",
    fontSize: 16,
  },
});

export default styles;
