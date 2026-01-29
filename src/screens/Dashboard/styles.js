import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#F5F5F5",
    margin: 10,
    marginBottom: 0,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 26,
    paddingLeft: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  upperContainer: {
    paddingTop: 10,
  },
  scrollContainer: {
    // backgroundColor: "#ffffffff",
    height: 650,
    marginTop: 15,
  },
  innerContainer: {
    flexDirection: "row",
    gap: 30,
    paddingRight: 10,
  },
  search: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    color: "#000000ff",
  },
  searchIcon: {},
  SearchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    paddingHorizontal: 15,
    padding: 15,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  focus: {
    borderWidth: 1,
    borderColor: "#5757f8",
  },
  line: {
    marginTop: 10,

    height: 1,
    backgroundColor: "#949494ff",
  },
  add: {
    position: "absolute",

    bottom: 20,
    //left: 20,
    right: 20,
    elevation: 6,
  },
  image: {
    height: 26,
    width: 26,
    borderRadius: 15,
    marginRight: 10,
  },
  listContent: {
    paddingBottom: 30,
  },
  bottomHeaderText: {
    fontSize: 20,
    width: 160,
    fontWeight: "600",
  },
  bottomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 15,
    marginRight: 15,
  },
});

export default styles;
