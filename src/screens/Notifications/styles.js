import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  card: {
    backgroundColor: "#E0E7FF",
    padding: 15,
    borderRadius: 20,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    marginBottom: 15,
  },
  outer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 56,
  },

  icon: {
    position: "absolute",
    right: 60,
    top: 4,
  },

  image: {
    position: "absolute",
    right: 15,
    top: 7,
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#0c6de5ff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
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
  },
});

export default styles;
