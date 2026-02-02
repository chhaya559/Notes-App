import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    gap: 10,
  },
  iconWrap: {
    height: 40,
    width: 40,
    backgroundColor: "#615FFF",
    borderRadius: 50,
    position: "relative",
    alignSelf: "center",
  },
  image: {
    height: 30,
    width: 30,
    borderRadius: 20,
    position: "absolute",
    left: 5,
    top: 6,
  },
  text: {
    fontSize: 18,
    color: "#5757f8",
    fontWeight: "600",
    alignSelf: "center",
  },
});
export default styles;
