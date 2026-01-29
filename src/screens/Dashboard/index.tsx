import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useGetQuery } from "@redux/api/noteApi";
import Card from "@components/atoms/Card";
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from "@react-navigation/drawer";
import { db } from "src/db/notes";
import { notesTable } from "src/db/schema";
import { createTable } from "src/db/createTable";
import { useFocusEffect } from "@react-navigation/native";
import Reminders from "@screens/Reminders";
import { and, eq } from "drizzle-orm";
import DashboardHeader from "@components/atoms/DashboardHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";

type DashboardProps = NativeStackScreenProps<any, "Dashboard">;

export function Dashboard({ navigation }: Readonly<DashboardProps>) {
  const [notes, setNotes] = useState<any[]>([]);
  const userId = useSelector((state: RootState) => state.auth.token);
  const [isFocused, setIsFocused] = useState(false);
  const { data } = useGetQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const { isConnected } = useNetInfo();

  useEffect(() => {
    if (!data?.data) return;
    if (!userId) return;

    async function syncNotes() {
      await createTable();
      // console.log("data", data?.data);
      for (const note of data.data) {
        const existing = db
          .select()
          .from(notesTable)
          .where(and(eq(notesTable.id, note.id), eq(notesTable.userId, userId)))
          .get();

        if (existing && existing.updatedAt === note.updatedAt) {
          continue;
        }

        await db
          .insert(notesTable)
          .values({
            id: note.id,
            userId,
            title: note.title,
            content: note.content,
            updatedAt: note.updatedAt,
            isPasswordProtected: note.isPasswordProtected ? 1 : 0,
            reminder: null,
            syncStatus: "synced",
          })
          .onConflictDoUpdate({
            target: notesTable.id,
            set: {
              title: note.title,
              content: note.content,
              updatedAt: note.updatedAt,
              syncStatus: "synced",
            },
          });
      }

      const notesFromDB = await db
        .select()
        .from(notesTable)
        .where(eq(notesTable.userId, userId));

      if (isConnected) {
        setNotes(data?.data);
      } else {
        setNotes(notesFromDB);
      }
      // setNotes(notescFromDB);
    }

    syncNotes();
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      const loadNotes = async () => {
        const notesFromDB = await db
          .select()
          .from(notesTable)
          .where(eq(notesTable.userId, userId));

        setNotes(notesFromDB);
      };

      loadNotes();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.bottomHeader}>
          <Text style={styles.bottomHeaderText}>
            Ready to write something new?
          </Text>
          <Image
            source={require("../../../assets/dash.png")}
            style={{ height: 65, width: 65 }}
          />
        </View>
        <View style={[styles.SearchBar, isFocused && styles.focus]}>
          <Ionicons
            name="search"
            color="#979090ff"
            size={22}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search notes..."
            placeholderTextColor="#979090ff"
            style={styles.search}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
      </View>

      {/* <View style={styles.line} /> */}

      <View style={[styles.scrollContainer, styles.listContent]}>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <Card
              id={item.id}
              title={item.title}
              content={item.content}
              updatedAt={item.updatedAt}
            />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No notes yet
            </Text>
          }
        />
      </View>

      <TouchableOpacity
        style={styles.add}
        onPress={() => navigation.navigate("CreateNote" as never)}
      >
        <Ionicons name="add-circle" size={60} color="#5157F8" />
      </TouchableOpacity>
    </View>
  );
}
