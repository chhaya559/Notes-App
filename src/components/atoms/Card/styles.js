import { Dimensions, StyleSheet } from "react-native";
const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const isSmallScreen = screenHeight < 800;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 20,
    margin: 10,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 7,
    borderRadius: 20,
    height: 90,
    width: "auto",
    gap: 8,
    // paddingLeft: 20,
    overflow: "hidden",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  created: {
    color: "#656565ff",
  },
  createdContainer: {
    flexDirection: "row",
    gap: 3,
    margin: 0,
  },
  iconsWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    verticalAlign: "middle",
    position: "absolute",
    right: 20,
    top: 26,
  },
  modal: {
    backgroundColor: "#fff",
    width: screenWidth * 0.9,
    marginTop: isSmallScreen ? screenHeight * 0.25 : screenHeight * 0.3,
    marginBottom: isSmallScreen ? screenHeight * 0.25 : screenHeight * 0.3,
    borderRadius: 10,
  },

  unlockHeading: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    color: "#5757f8",
    paddingTop: 10,
    paddingBottom: 0,
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
    right: 10,
    top: -25,
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
    width: 45,
    alignItems: "center",
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
    // backgroundColor: "#adadadff",
    //borderRadius: 25,
    //padding: 6,
  },

  delete: {
    backgroundColor: "#d60f0fff",
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 7,
    borderRadius: 20,
    height: 80,
    width: 60,
    // position: "absolute",
  },
  deleteIcon: {
    top: 5,
    right: 5,
  },
  swipe: {
    flexDirection: "row",
  },
});
export default styles;
