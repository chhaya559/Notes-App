import { StyleSheet } from "react-native";
import { SearchBar } from "react-native-screens";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 26,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  upperContainer: {},
  scrollContainer: {},
  innerContainer: {
    flexDirection: "row",
    gap: 30,
  },
  search: {
    // position: "relative",
  },
  searchIcon: {
    // position: "absolute",
  },
  SearchBar: {
    flexDirection: "row",
    gap: 8,
    margin: 5,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#949494ff",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#e6e2e2ff",
  },
  line: {
    marginTop: 10,
    marginBottom: 10,
    height: 1,
    backgroundColor: "#949494ff",
  },
  add: {
    position: "absolute",
    bottom: 40,
    //left: 20,
    right: 40,
  },
});

export default styles;
