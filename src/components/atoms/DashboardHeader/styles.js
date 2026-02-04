import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
    top: -480,
    right: 5,
  },
  modal: {
    padding: 10,
    borderRadius: 12,
    height: 500,
    backgroundColor: "#fefeffff",
    shadowColor: "#5757f8",
    shadowOpacity: 0.7,
  },
  card: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    backgroundColor: "#adbff0ff",
    borderRadius: 10,
    margin: 5,
    padding: 10,
    shadowColor: "#3973baff",
    shadowOpacity: 0.7,
    marginBottom: 10,
  },
  pressable: {
    padding: 7,
    backgroundColor: "#5757f8",
    borderRadius: 20,
    marginTop: 10,
    // marginLeft: 200,
    // marginRight: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  emptyList: {},
  notification: {
    alignSelf: "center",
    margin: 20,
  },
  noNotification: {
    textAlign: "center",
    color: "#5757f8",
    fontSize: 28,
    fontWeight: "bold",
  },
  text: {
    textAlign: "center",
    color: "#5b5b5bff",
    margin: 10,
    fontSize: 20,
    fontWeight: "500",
  },
});

export default styles;
