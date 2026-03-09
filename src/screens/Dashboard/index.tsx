import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import {
  useDeleteMutation,
  useGetQuery,
  useLazyGetNoteByIdQuery,
  useSaveNoteMutation,
  useSearchNotesQuery,
  useUpdateMutation,
  useUploadFileMutation,
} from "@redux/api/noteApi";
import Card from "@components/atoms/Card";
import { db, pendingDb } from "src/db/notes";
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
import { createPendingTable } from "src/db/pendingNotes/pendingTable";
import { pendingNotes } from "src/db/pendingNotes/schema";
import EmptyListComponent from "@components/atoms/EmptyListComponent";
import ListFooterComponent from "@components/atoms/ListFooterComponent";
import { getFirstLinePreview, sanitizeSearch } from "@utils/utility";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type DashboardProps = NativeStackScreenProps<any, "Dashboard">;

export function Dashboard({ navigation }: Readonly<DashboardProps>) {
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const userId = useSelector((state: RootState) => state.auth.token);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
  const { isConnected } = useNetInfo();
  const [page, setPage] = useState(1);
  const { dynamicStyles } = useStyles(styles);
  const [editApi] = useUpdateMutation();
  const [saveApi] = useSaveNoteMutation();
  const [deleteApi] = useDeleteMutation();
  const [uploadApi] = useUploadFileMutation();
  const { Colors } = useTheme();
  const dispatch = useDispatch();
  const [getNoteById] = useLazyGetNoteByIdQuery();
  const token = useSelector((state: RootState) => state.auth.token);
  const notesUnlockUntil = useSelector(
    (state: RootState) => state.auth.notesUnlockUntil,
  );
  const [loadingLocalNotes, setLoadingLocalNotes] = useState(true);

  function clearSearchText() {
    setSearchText("");
  }

  useEffect(() => {
    createTable();
    createPendingTable();
  }, []);

  // --------------- pagination -------------------
  const pageSize = 10;
  const { data, isFetching } = useGetQuery<any>(
    {
      pageSize: pageSize,
      pageNumber: page,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (!data?.data) return;
    if (page === 1) {
      setAllNotes(data.data);
    } else {
      setAllNotes((prev) => [...prev, ...data.data]);
    }
  }, [data]);

  const loadMore = () => {
    if (!isSearching && !isFetching && data?.data?.length === pageSize) {
      setPage((prev) => prev + 1);
    }
  };
  useFocusEffect(
    useCallback(() => {
      setPage(1);
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      setSearchText("");
      setIsFocused(false);
    }, []),
  );

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

  // notes load based on connection
  useFocusEffect(
    useCallback(() => {
      if (isGuest) {
        showNotesFromCombinedDB();
        return;
      }

      if (isConnected) {
        syncOnlineFlow();
      } else {
        showNotesFromCombinedDB();
      }
    }, [isConnected, page, token, data]),
  );

  async function syncOnlineFlow() {
    await syncPendingNotesToBackend();
    await fetchBackendAndStoreLocal();
  }

  async function syncPendingNotesToBackend() {
    const notesToSendBackend = await pendingDb
      .select()
      .from(pendingNotes)
      .where(eq(pendingNotes.userId, String(userId)));

    if (!notesToSendBackend.length) return;

    for (const note of notesToSendBackend) {
      try {
        let content = note.content || "";

        const imageUris =
          content.match(/(file:\/\/|content:\/\/|ph:\/\/)[^"]+/g) || [];

        const uploadedPaths = [];

        for (const uri of imageUris) {
          try {
            const formData = new FormData();

            formData.append("file", {
              uri,
              type: "image/jpeg",
              name: "offline-image.jpg",
            } as any);

            const response = await uploadApi(formData).unwrap();

            const serverPath = response?.data?.path;

            if (serverPath) {
              content = content.replace(uri, serverPath);
              uploadedPaths.push(serverPath);
            }
          } catch (e) {
            console.log("Offline image upload failed", e);
          }
        }

        const filePaths =
          uploadedPaths.length > 0
            ? uploadedPaths
            : JSON.parse(note.filePaths || "[]");

        switch (note.syncStatus) {
          case 1:
            await saveApi({
              id: note.id,
              title: note.title,
              content,
              filePaths,
            }).unwrap();
            break;

          case 2: {
            const idExists = await getNoteById({ id: note.id }).unwrap();

            if (idExists?.success) {
              await editApi({
                id: note.id,
                title: note.title,
                content,
                filePaths,
              }).unwrap();
            } else {
              await saveApi({
                id: note.id,
                title: note.title,
                content,
                filePaths,
              }).unwrap();
            }
            break;
          }

          case 3:
            await deleteApi({ id: note.id }).unwrap();

            await db.delete(notesTable).where(eq(notesTable.id, note.id));
            break;
        }

        if (note.syncStatus !== 3) {
          await pendingDb
            .delete(pendingNotes)
            .where(eq(pendingNotes.id, note.id));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function fetchBackendAndStoreLocal() {
    if (!data?.data) return;

    const pending = await pendingDb.select().from(pendingNotes);

    const deletedSet = new Set(
      pending.filter((n) => n.syncStatus === 3).map((n) => n.id),
    );

    for (const note of data.data) {
      if (deletedSet.has(String(note.id))) continue;

      await db
        .insert(notesTable)
        .values({
          id: String(note.id),
          userId: String(userId),
          title: note.title,
          content: note.content,
          updatedAt: note.updatedAt,
          filePaths: JSON.stringify(note.filePaths ?? []),
          syncStatus: "synced",
          isLocked: note.isLocked,
          isPasswordProtected: note.isPasswordProtected,
          isReminderSet: note.isReminderSet,
        })
        .onConflictDoUpdate({
          target: notesTable.id,
          set: {
            title: note.title,
            content: note.content,
            updatedAt: note.updatedAt,
            filePaths: JSON.stringify(note.filePaths ?? []),
            syncStatus: "synced",
            isLocked: note.isLocked,
            isPasswordProtected: note.isPasswordProtected,
            isReminderSet: note.isReminderSet,
          },
        });
    }
  }

  async function showNotesFromCombinedDB() {
    try {
      setLoadingLocalNotes(true);

      const localNotes = await db
        .select()
        .from(notesTable)
        .where(eq(notesTable.userId, String(userId)));

      const pending = await pendingDb
        .select()
        .from(pendingNotes)
        .where(eq(pendingNotes.userId, String(userId)));

      const deletedSet = new Set(
        pending.filter((n) => n.syncStatus === 3).map((n) => String(n.id)),
      );

      const pendingMap = new Map();

      pending.forEach((note) => {
        if (note.userId !== String(userId)) return;

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

      for (const local of localNotes) {
        if (local.userId !== String(userId)) continue;
        if (deletedSet.has(String(local.id))) continue;

        finalMap.set(local.id, local);
      }

      pendingMap.forEach((note, id) => {
        finalMap.set(id, note);
      });

      const merged = Array.from(finalMap.values());

      merged.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt).getTime() -
          new Date(a.updatedAt || a.createdAt).getTime(),
      );

      setAllNotes(merged);
    } catch (e) {
      console.log("Error loading local notes", e);
    } finally {
      setLoadingLocalNotes(false);
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: Colors.background,
      },
    });
  }, [Colors.background]);

  const searchInputRef = useRef<TextInput | null>(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      searchInputRef.current?.blur();
    });

    return unsubscribe;
  }, [navigation]);

  //search
  const sanitizedSearch = sanitizeSearch(searchText);

  const debouncedSearch = useDebounce(sanitizedSearch, 200);

  const isSearching = debouncedSearch.length > 0;

  const { data: SearchedNotes } = useSearchNotesQuery(debouncedSearch, {
    skip: !isSearching,
  });

  //pan gesture
  const pressed = useSharedValue<boolean>(false);
  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onFinalize(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      pressed.value = false;
    });

  const AddStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: withTiming(pressed.value ? 1.1 : 1) },
    ],
  }));

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  //display
  const displayNotes = isSearching
    ? (SearchedNotes?.data ?? [])
    : (allNotes ?? []);

  const [firstLoad] = useState(true);

  if (loadingLocalNotes && firstLoad) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
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

      {allNotes?.length > 0 && (
        <View
          style={[
            dynamicStyles.SearchBar,
            isFocused ? dynamicStyles.focus : dynamicStyles.SearchBar,
          ]}
        >
          <Ionicons name="search" color={Colors.iconPrimary} size={22} />
          <TextInput
            ref={searchInputRef}
            placeholder="Search notes..."
            placeholderTextColor={Colors.placeholder}
            style={dynamicStyles.search}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
            }}
            onSubmitEditing={() => {
              searchInputRef.current?.blur();
            }}
            autoCorrect={false}
            cursorColor={Colors.primary}
            selectionColor={Colors.primary}
          />
          {searchText ? (
            <TouchableOpacity onPress={clearSearchText}>
              <MaterialIcons
                name="clear"
                size={24}
                color={Colors.iconPrimary}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {/* Card components */}
      <FlatList
        data={displayNotes}
        bounces={false}
        keyExtractor={(item, index) =>
          item?.id ? String(item.id) : `note-${index}`
        }
        renderItem={({ item }) => (
          <Card
            id={item.id}
            title={item.title}
            content={item.content}
            preview={getFirstLinePreview(item.content)}
            filePaths={item.filePaths}
            updatedAt={item.updatedAt}
            isPasswordProtected={item.isPasswordProtected}
            isReminderSet={item.isReminderSet}
            isLocked={item.isLocked}
            onDeleteSuccess={showNotesFromCombinedDB}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          <ListFooterComponent isFetching={isFetching} page={page} />
        }
        ListEmptyComponent={
          <EmptyListComponent
            isSearching={isSearching}
            debouncedSearch={debouncedSearch}
          />
        }
      />

      {/* Create Note */}
      <GestureDetector gesture={pan}>
        <AnimatedTouchable
          style={[dynamicStyles.add, AddStyles]}
          onPress={() => navigation.navigate("CreateNote" as never)}
        >
          <Ionicons name="add-circle" size={60} color={Colors.gradientStart} />
        </AnimatedTouchable>
      </GestureDetector>
    </View>
  );
}
