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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useGetQuery, useSearchNotesQuery } from "@redux/api/noteApi";
import Card from "@components/atoms/Card";
import { db } from "src/db/notes";
import { notesTable } from "src/db/schema";
import { createTable } from "src/db/createTable";
import { eq } from "drizzle-orm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";
import useDebounce from "src/debounce/debounce";
import { lockNotes } from "@redux/slice/authSlice";
import { useFocusEffect } from "@react-navigation/native";
import Slider from "@screens/Slider";

type DashboardProps = NativeStackScreenProps<any, "Dashboard">;
type Note = {
  id: string;
  title: string | null;
  content: string | null;
  updatedAt: string;
  backgroundColor?: string | null;
  isPasswordProtected: number;
  isLocked: number;
  isReminderSet: number;
  filePaths?: string[] | [];
};
export function Dashboard({ navigation }: Readonly<DashboardProps>) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const userId = useSelector((state: RootState) => state.auth.token);
  const { isConnected } = useNetInfo();
  const [page, setPage] = useState(1);
  const isNotesUnlocked = useSelector(
    (state: RootState) => state.auth.isNotesUnlocked,
  );

  function clearSearchText() {
    setSearchText("");
  }

  const { data, refetch, isFetching } = useGetQuery<any>(
    {
      pageSize: 10,
      pageNumber: page,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );
  const notesUnlockUntil = useSelector(
    (state: RootState) => state.auth.notesUnlockUntil,
  );

  const loadMore = () => {
    if (!isFetching && data?.data?.length === 10) {
      setPage((prev) => prev + 1);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (!notesUnlockUntil) return;

    const remaining = notesUnlockUntil - Date.now();

    if (remaining <= 0) {
      dispatch(lockNotes());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(lockNotes());
    }, remaining);

    return () => clearTimeout(timer);
  }, [notesUnlockUntil]);

  useEffect(() => {
    if (!data?.data) return;

    if (page === 1) {
      setAllNotes(data.data);
    } else {
      setAllNotes((prev) => [...prev, ...data.data]);
    }
  }, [data]);
  console.log(allNotes);

  const loadNotes = useCallback(async () => {
    if (!userId) return;

    const notesFromDB = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.userId, userId));

    setNotes(
      notesFromDB.map((n) => ({
        ...n,
        title: n.title ?? "",
        content: n.content ?? "",
        updatedAt: n.updatedAt ?? new Date().toISOString(),
        backgroundColor: n.backgroundColor ?? "#f5f5f5",
        isPasswordProtected: n.isPasswordProtected ? 1 : 0,
        isReminderSet: n.isReminderSet ? 1 : 0,
        isLocked: n.isLocked ? 1 : 0,
        filePaths: n.filePaths ? JSON.parse(n.filePaths) : [],
      })),
    );
  }, [userId]);

  const syncNotes = useCallback(async () => {
    if (!data?.data || !userId) return;

    if (page === 1) {
      await db.delete(notesTable).where(eq(notesTable.userId, userId));
    }
    for (const note of data.data) {
      await db
        .insert(notesTable)
        .values({
          id: note.id,
          userId,
          title: note.title,
          content: note.content,
          updatedAt: note.updatedAt,
          isPasswordProtected: note.isPasswordProtected ? 1 : 0,
          isLocked: note.isLocked ? 1 : 0,
          isReminderSet: note.isReminderSet ? 1 : 0,
          syncStatus: "synced",
          filePaths: note.filePaths ? JSON.stringify(note.filePaths) : null,
          backgroundColor: note.backgroundColor ?? "#f5f5f5",
        })
        .onConflictDoUpdate({
          target: notesTable.id,
          set: {
            title: note.title,
            content: note.content,
            updatedAt: note.updatedAt,
            syncStatus: "synced",
            filePaths: note.filePaths ? JSON.stringify(note.filePaths) : null,
            isPasswordProtected: note.isPasswordProtected ? 1 : 0,
            isLocked: note.isLocked ? 1 : 0,
            isReminderSet: note.isReminderSet ? 1 : 0,
            backgroundColor: note.backgroundColor ?? "#f5f5f5",
          },
        });
    }
  }, [data, userId]);

  useEffect(() => {
    async function create() {
      await createTable();
    }
    create();
  }, []);

  useEffect(() => {
    if (!isConnected || !userId) return;

    async function run() {
      await syncNotes();
      await loadNotes();
    }

    run();
  }, [data, isConnected, userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        setPage(1);
        refetch();
      }
    }, [userId]),
  );

  //search
  const debouncedSearch = useDebounce(searchText, 200);

  const { data: SearchedNotes } = useSearchNotesQuery(debouncedSearch, {
    skip: debouncedSearch.trim().length === 0,
  });

  const isSearching = debouncedSearch.trim().length > 0;

  const displayNotes = isSearching
    ? (SearchedNotes?.data ?? [])
    : (allNotes ?? []);

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.bottomHeader}>
          <View style={{ flexDirection: "column", gap: 10 }}>
            <Text style={styles.bottomHeaderText}>
              Start Capturing your thoughts
            </Text>
            <Text style={styles.headerText}>
              Your ideas deserve a place to live
            </Text>
          </View>
          <Image
            source={require("../../../assets/dash.png")}
            style={{ height: 85, width: 85 }}
          />
        </View>
        {/* Search Icon */}
        {data?.data?.length > 0 && (
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
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoCorrect={false}
              cursorColor="#5757f8"
              selectionColor="#5757f8"
            />
            {searchText && (
              <TouchableOpacity onPress={clearSearchText}>
                <MaterialIcons name="clear" size={22} color="#979090ff" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Card components */}
      <View style={[styles.scrollContainer, styles.listContent]}>
        <FlatList
          data={displayNotes}
          bounces={false}
          keyExtractor={(item) => item.id}
          scrollEnabled={displayNotes.length > 0}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <Card
              id={item.id}
              title={item.title}
              updatedAt={item.updatedAt}
              backgroundColor={item.backgroundColor}
              isPasswordProtected={item.isPasswordProtected && !isNotesUnlocked}
              isReminderSet={item.isReminderSet}
              isLocked={item.isLocked}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={() => {
            if (isSearching) {
              return (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No results for “{debouncedSearch}”
                  </Text>
                  <Text style={styles.text}>Try a different keyword</Text>
                </View>
              );
            }

            return (
              <View style={styles.emptyContainer}>
                <Image
                  source={require("../../../assets/dash.png")}
                  style={{ height: 250, width: 250 }}
                />
                <Text style={styles.emptyText}>No notes yet</Text>
                <Text style={styles.text}>
                  Tap the + button to write your first thought or idea
                </Text>
              </View>
            );
          }}
        />
      </View>

      {/* Create Note */}
      <TouchableOpacity
        style={styles.add}
        onPress={() => navigation.navigate("CreateNote" as never)}
      >
        <Ionicons name="add-circle" size={60} color="#5157F8" />
      </TouchableOpacity>
    </View>
  );
}
