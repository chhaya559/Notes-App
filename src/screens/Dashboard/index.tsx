import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import {
  useGetQuery,
  useSearchNotesQuery,
  useUpdateMutation,
} from "@redux/api/noteApi";
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
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";

type DashboardProps = NativeStackScreenProps<any, "Dashboard">;
type Note = {
  id: string;
  title: string | null;
  content: string | null;
  updatedAt: string;
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
  const { dynamicStyles } = useStyles(styles);
  const [editApi] = useUpdateMutation();
  const { Colors, darkMode } = useTheme();
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
    if (!isSearching && !isFetching && data?.data?.length === 10) {
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

  const syncPendingNotes = async () => {
    if (!isConnected || !userId) return;

    const pendingNotes = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.syncStatus, "pending"));

    for (const note of pendingNotes) {
      try {
        await editApi({
          id: note.id,
          title: note.title,
          content: note.content,
          filePaths: note.filePaths ? JSON.parse(note.filePaths) : [],
        }).unwrap();

        await db
          .update(notesTable)
          .set({ syncStatus: "synced" })
          .where(eq(notesTable.id, note.id));
      } catch (e) {
        console.log("sync failed");
      }
    }
  };

  useEffect(() => {
    if (isConnected) {
      syncPendingNotes();
    }
  }, [isConnected]);

  useEffect(() => {
    if (!data?.data) return;

    if (page === 1) {
      setAllNotes(data.data);
    } else {
      setAllNotes((prev) => [...prev, ...data.data]);
    }
  }, [data]);

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

  //header
  navigation.setOptions({
    headerStyle: {
      backgroundColor: darkMode ? Colors.background : Colors.background,
    },
  });
  //search
  const debouncedSearch = useDebounce(searchText.trim(), 200);

  const { data: SearchedNotes } = useSearchNotesQuery(debouncedSearch, {
    skip: debouncedSearch.trim().length === 0,
  });

  const isSearching = debouncedSearch.trim().length > 0;

  const displayNotes = isSearching
    ? (SearchedNotes?.data ?? [])
    : (allNotes ?? []);

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.static}>
        <Text style={dynamicStyles.staticText}>Capture your</Text>
        <Text style={dynamicStyles.staticText}>thoughts</Text>
        <Text style={dynamicStyles.staticSecondaryText}>
          Your ideas deserve a place to live
        </Text>
      </View>
      {/* Search*/}
      {data?.data?.length > 0 && (
        <View
          style={[dynamicStyles.SearchBar, isFocused && dynamicStyles.focus]}
        >
          <Ionicons name="search" color={Colors.iconPrimary} size={22} />
          <TextInput
            placeholder="Search notes..."
            placeholderTextColor={Colors.placeholder}
            style={dynamicStyles.search}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCorrect={false}
            cursorColor={Colors.primary}
            selectionColor={Colors.primary}
          />
          {searchText && (
            <TouchableOpacity onPress={clearSearchText}>
              <MaterialIcons
                name="clear"
                size={24}
                color={Colors.iconPrimary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* <View style={dynamicStyles.optionContainer}>
        <TouchableOpacity style={dynamicStyles.option}>
          <Text style={dynamicStyles.optionText}>All Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.option}>
          <Text style={dynamicStyles.optionText}>Locked</Text>
        </TouchableOpacity>
      </View> */}
      {/* Card components */}
      <FlatList
        data={displayNotes}
        bounces={false}
        keyExtractor={(item) => item.id}
        scrollEnabled={displayNotes.length > 0}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <Card
            key={item.id}
            id={item.id}
            title={item.title}
            content={item.content}
            updatedAt={item.updatedAt}
            isPasswordProtected={item.isPasswordProtected}
            isReminderSet={item.isReminderSet}
            isLocked={item.isLocked}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() =>
          isFetching && page > 1 ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : (
            <View style={{ height: 100 }} />
          )
        }
        ListEmptyComponent={() => {
          if (isSearching) {
            return (
              <View style={dynamicStyles.emptyContainer}>
                <Text style={dynamicStyles.emptyText}>
                  No results for “{debouncedSearch.trim()}”
                </Text>
                <Text style={dynamicStyles.emptySecondaryText}>
                  Try a different keyword
                </Text>
              </View>
            );
          }

          return (
            <View style={dynamicStyles.emptyContainer}>
              {/* <Image
                source={
                  darkMode
                    ? require("../../../assets/dark.png")
                    : require("../../../assets/light.png")
                }
                style={{
                  borderRadius: 40,
                  height: 200,
                  width: 200,
                  alignSelf: "center",
                }}
                resizeMode="contain"
              /> */}
              <MaterialCommunityIcons
                name="note-multiple-outline"
                size={60}
                color={Colors.iconPrimary}
                style={{ alignSelf: "center", paddingBottom: 10 }}
              />
              <Text style={dynamicStyles.emptyText}>No notes yet</Text>
              <Text style={dynamicStyles.emptySecondaryText}>
                Tap the + button to write your first thought or idea
              </Text>
            </View>
          );
        }}
      />

      {/* Create Note */}
      <TouchableOpacity
        style={dynamicStyles.add}
        onPress={() => navigation.navigate("CreateNote" as never)}
      >
        <Ionicons name="add-circle" size={60} color={Colors.gradientStart} />
      </TouchableOpacity>
    </View>
  );
}
