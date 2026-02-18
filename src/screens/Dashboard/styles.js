import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    padding: 10,
    marginTop: 0,
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
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginTop: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#c9c7c7ff",
    shadowOpacity: 0.2,
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
    borderRadius: 25,
    backgroundColor: "#fff",
    height: 55,
    shadowColor: "#000",
    shadowOpacity: 0.1,
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

    bottom: 40,
    //left: 20,
    right: 15,
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
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: "#eaeaecff",
  },
  bottomHeaderText: {
    fontSize: 22,
    width: 160,
    fontWeight: "500",
  },
  headerText: {
    fontSize: 16,
    margin: 5,
    marginLeft: 0,
  },
  bottomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: "#F5F5F5",
  },
  emptyText: {
    fontWeight: "500",
    fontSize: 22,
    textAlign: "center",
  },
  text: {
    textAlign: "center",
    margin: 10,
  },
  emptyContainer: {
    flex: "1",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 70,
    paddingBottom: 30,
    paddingLeft: 50,
    paddingRight: 50,
  },
});

export default styles;
