import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { logout } from "@redux/slice/authSlice";
import { useGetQuery } from "@redux/api/noteApi";
import Card from "@components/atoms/Card";

import { useNetwork } from "src/network/useNetwork";
import { Storage } from "src/db/Storage";
import { db } from "src/db/notes";
import { notesTable } from "src/db/schema";

type DashboardProps = NativeStackScreenProps<RootStackParamList, "Dashboard">;
export default function Dashboard({ navigation }: Readonly<DashboardProps>) {
  const dispatch = useDispatch<AppDispatch>();
  const [Theme, setTheme] = useState<"light" | "dark">("light");
  function handleLogout() {
    dispatch(logout());
  }
  const [notes, setNotes] = useState<any[]>([]);
  const { data } = useGetQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!data?.data) return;
    async function addDatatoLocalDB() {
      try {
        for (const note of data.data) {
          await Storage.setItem(
            note.id,
            JSON.stringify({
              title: note.title,
              content: note.content,
              createdAt: note.createdAt,
              isLocked: note.isLocked,
              reminder: note.reminder,
              syncStatus: note.syncStatus,
            }),
          );
        }
        const notesFromDB = await db.select().from(notesTable);
        setNotes(notesFromDB);
      } catch (error) {
        console.log(error);
      }
    }
    addDatatoLocalDB();
  }, [data]);
  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.header}>
          <Text style={styles.heading}>My Notes</Text>
          <View style={styles.innerContainer}>
            <MaterialIcons name="notifications" size={26} />
            <AntDesign name="logout" size={26} onPress={handleLogout} />
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
            <Pressable onPress={() => navigation.navigate("Profile")}>
              <Image
                source={require("../../../assets/avatar.png")}
                style={styles.image}
              />
            </Pressable>
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
      <View style={styles.scrollContainer}>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card title={item.title} content={item.preview} id={item.id} />
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.add}
        onPress={() => navigation.navigate("CreateNote", {})}
      >
        <Ionicons name="add-circle" size={60} color="#5157F8" />
      </TouchableOpacity>
    </View>
  );
}
