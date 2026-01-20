import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { logout } from "@redux/slice/authSlice";
import Card from "@components/atoms/Card";

type DashboardProps = NativeStackScreenProps<RootStackParamList, "Dashboard">;
export default function Dashboard({ navigation }: DashboardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [Theme, setTheme] = useState<"light" | "dark">("light");
  function handleLogout() {
    dispatch(logout());
  }

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.header}>
          <Text style={styles.heading}>My Notes</Text>
          <View style={styles.innerContainer}>
            <MaterialIcons name="notifications" size={26} />
            <Pressable
              onPress={() =>
                Theme == "dark" ? setTheme("light") : setTheme("dark")
              }
            >
              {Theme == "light" ? (
                <MaterialIcons name="dark-mode" size={26} />
              ) : (
                <MaterialIcons name="light-mode" size={26} />
              )}
            </Pressable>
            <AntDesign name="logout" size={26} onPress={handleLogout} />
          </View>
        </View>
        <View style={styles.SearchBar}>
          <Ionicons
            name="search"
            color="#525252ff"
            size={20}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search notes..."
            placeholderTextColor="#525252ff"
            style={styles.search}
          />
        </View>
      </View>
      <View style={styles.line} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card />
      </ScrollView>
      <MaterialIcons
        name="add-circle"
        size={60}
        color="#5157F8"
        style={styles.add}
      />
    </View>
  );
}
