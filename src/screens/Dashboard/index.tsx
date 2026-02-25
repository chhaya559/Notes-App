import {
  ActivityIndicator,
  FlatList,
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
  useDeleteMutation,
  useGetNoteByIdQuery,
  useGetQuery,
  useLazyGetNoteByIdQuery,
  useSaveNoteMutation,
  useSearchNotesQuery,
  useUpdateMutation,
} from "@redux/api/noteApi";
import Card from "@components/atoms/Card";
import { db, pendingDb } from "src/db/notes";
import { notesTable } from "src/db/schema";
import { getLocalNotesPaginated } from "src/db/queries";
import { createTable } from "src/db/createTable";
import { eq } from "drizzle-orm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";
import useDebounce from "src/debounce/debounce";
import { lockNotes } from "@redux/slice/authSlice";
import { useFocusEffect } from "@react-navigation/native";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
import { createPendingTable } from "src/db/pendingNotes/pendingTable";
import { pendingNotes } from "src/db/pendingNotes/schema";

type DashboardProps = NativeStackScreenProps<any, "Dashboard">;

export function Dashboard({ navigation }: Readonly<DashboardProps>) {
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const userId = useSelector((state: RootState) => state.auth.token);
  const { isConnected } = useNetInfo();
  const [page, setPage] = useState(1);
  const { dynamicStyles } = useStyles(styles);
  const [editApi] = useUpdateMutation();
  const [saveApi] = useSaveNoteMutation();
  const [deleteApi] = useDeleteMutation();
  const { Colors } = useTheme();

  function clearSearchText() {
    setSearchText("");
  }
  useEffect(() => {
    createTable();
    createPendingTable();
  }, []);

  const { data, isFetching } = useGetQuery<any>(
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

  useFocusEffect(
    useCallback(() => {
      if (isConnected) {
        syncOnlineFlow();
      } else {
        showNotesFromCombinedDB();
      }
    }, [isConnected, page]),
  );

  // async function syncOnlineFlow() {
  //   await syncPendingNotesToBackend();

  //   await fetchBackendAndStoreLocal();

  //   await loadLocalNotes();
  // }

  async function syncOnlineFlow() {
    await syncPendingNotesToBackend();

    await fetchBackendAndStoreLocal();

    await showNotesFromCombinedDB();
  }
  const [getNoteById] = useLazyGetNoteByIdQuery();
  async function syncPendingNotesToBackend() {
    const notesToSendBackend = await pendingDb.select().from(pendingNotes);

    if (!notesToSendBackend.length) return;

    for (const note of notesToSendBackend) {
      try {
        if (note.syncStatus === 1) {
          console.log(note, "note to save");
          const res = await saveApi({
            title: note.title,
            content: note.content,
            filePaths: JSON.parse(note.filePaths || "[]"),
          }).unwrap();
          console.log(res, "es form save");
        }

        if (note.syncStatus === 2) {
          console.log(note, "note to edit");
          try {
            const idExists = await getNoteById({ id: note.id });
            console.log(idExists, "fregetgt");

            if (idExists.data?.success) {
              const res = await editApi({
                id: note.id,
                title: note.title,
                content: note.content,
                filePaths: JSON.parse(note.filePaths || "[]"),
              }).unwrap();
              console.log(res, "edit");
            } else {
              const res = await saveApi({
                title: note.title,
                content: note.content,
                filePaths: JSON.parse(note.filePaths || "[]"),
              }).unwrap();
              console.log(res, "es form save");
            }
          } catch (error) {
            console.log(error);
          }
        }
        if (note.syncStatus === 3) {
          console.log("note to delete", note);

          const res = await deleteApi({ id: note.id }).unwrap();
          console.log(res, "resres");
          await db.delete(notesTable).where(eq(notesTable.id, note.id));
        }

        await pendingDb
          .delete(pendingNotes)
          .where(eq(pendingNotes.id, note.id));
      } catch (e) {
        console.log("Sync failed", e);
      }
    }
    showNotesFromCombinedDB();
  }

  async function loadLocalNotes() {
    const notes = await getLocalNotesPaginated(userId, page);

    setAllNotes(notes);
  }

  async function fetchBackendAndStoreLocal() {
    if (!data?.data) return;

    for (const note of data.data) {
      await db
        .insert(notesTable)
        .values({
          id: note.id,
          userId,
          title: note.title,
          content: note.content,
          updatedAt: note.updatedAt,
          filePaths: JSON.stringify(note.filePaths ?? []),
          syncStatus: "synced",
        })
        .onConflictDoUpdate({
          target: notesTable.id,
          set: {
            title: note.title,
            content: note.content,
            updatedAt: note.updatedAt,
            filePaths: JSON.stringify(note.filePaths ?? []),
            syncStatus: "synced",
          },
        });
    }
  }

  async function showNotesFromCombinedDB() {
    const localNotes = await getLocalNotesPaginated(userId, page);
    const pending = await pendingDb.select().from(pendingNotes);

    const pendingMap = new Map();
    const deletedSet = new Set();

    // Process pending
    pending.forEach((note) => {
      if (note.syncStatus === 3) {
        deletedSet.add(note.id);
        return;
      }

      pendingMap.set(note.id, {
        ...note,
        filePaths: JSON.parse(note.filePaths || "[]"),
      });
    });

    const finalMap = new Map();

    // Add local notes
    for (const local of localNotes) {
      if (deletedSet.has(local.id)) continue;
      finalMap.set(local.id, local);
    }

    // Override with pending notes
    pendingMap.forEach((note, id) => {
      finalMap.set(id, note);
    });

    // Convert to array
    const merged = Array.from(finalMap.values());

    // ✅ Sort New → Old
    merged.sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime(),
    );

    setAllNotes(merged);
  }
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: Colors.background,
      },
    });
  }, [Colors.background]);
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

      {allNotes.length > 0 && (
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
        contentContainerStyle={{ paddingBottom: 0 }}
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
            onDeleteSuccess={showNotesFromCombinedDB}
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
