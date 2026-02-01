import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  backgroundContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c8c7c7",
    height: "auto",
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOffset: 0.2,
    elevation: 6,
    marginRight: 20,
    marginLeft: 20,
  },
  backgroundOptionsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text:{
    textAlign : "center",
    margin : 2,
    fontWeight : "regular",
    fontSize: 15
  }
});

export default styles;
