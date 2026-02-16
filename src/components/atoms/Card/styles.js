import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 15,
    margin: 10,
    marginHorizontal: 10,
    marginVertical: 7,
    borderRadius: 20,
    height: 80,
    width: "auto",
    elevation: 3,
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    margin: 5,
  },
  text: {
    margin: 5,
  },
  created: {},
  createdContainer: {
    flexDirection: "row",
    gap: 3,
    margin: 5,
  },
  iconsWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    position: "absolute",
    right: 20,
    top: 15,
  },
  modal: {
    backgroundColor: "#ffffffff",
    marginTop: 250,
    width: 350,
    marginBottom: 250,
    borderRadius: 10,
    padding: 10,
  },
  unlockHeading: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    color: "#5757f8",
  },
  passwordText: {
    marginLeft: 15,
    marginBottom: 0,
  },
  pressable: {
    backgroundColor: "#5757f8",
    margin: 15,
    borderRadius: 15,
    padding: 10,
  },
  pressableText: {
    color: "#fff",
    padding: 7,
    fontSize: 18,
    textAlign: "center",
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  counter: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 10,
  },
  counterTime: {
    backgroundColor: "#D0DAF3",
    borderRadius: 10,
  },
  time: {
    color: "#ffffffff",
    padding: 7,
    fontSize: 22,
  },
  counterActive: {
    backgroundColor: "#5757f8",
  },
  timeText: {
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 10,
    fontSize: 18,
  },
  icon: {
    backgroundColor: "#adadadff",
    borderRadius: 25,
    padding: 6,
  },

  delete: {
    position: "absolute",
    right: 20,
    top: 7,
    bottom: 0,
    width: 300,
    height: 80,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
export default styles;
