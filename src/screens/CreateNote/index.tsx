import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  TextInput,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Text,
  Alert,
  Image,
  FlatList,
  Linking,
} from "react-native";
import styles from "./style";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import {
  useAiSummaryMutation,
  useDeleteMutation,
  useGetNoteByIdQuery,
  useNoteLockMutation,
  useSaveNoteMutation,
  useUpdateMutation,
  useUploadFileMutation,
} from "@redux/api/noteApi";
import { DocumentPickerResponse, pick } from "@react-native-documents/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { useNetInfo } from "@react-native-community/netinfo";
import { createTable } from "src/db/createTable";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { notesTable, SyncStatus } from "src/db/schema";
import Toast from "react-native-toast-message";
import { db } from "src/db/notes";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { and, eq } from "drizzle-orm";
import BackgroundColor from "@components/Molecules/BackgroundColor";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Reminder from "@components/atoms/Reminder";
import { useFocusEffect } from "@react-navigation/native";
import Summary from "@components/atoms/Summary";
import useDebounce from "src/debounce/debounce";
import FileViewer from "react-native-file-viewer";

type CreateNoteProps = NativeStackScreenProps<RootStackParamList, "CreateNote">;

export default function CreateNote({
  navigation,
  route,
}: Readonly<CreateNoteProps>) {
  const userId = useSelector((state: RootState) => state.auth.token);
  const isGuestFromStore = useSelector(
    (state: RootState) => state.auth.isGuest,
  );

  const [isGuest, setIsGuest] = useState(isGuestFromStore);

  useFocusEffect(
    useCallback(() => {
      setIsGuest(isGuestFromStore);
    }, [isGuestFromStore]),
  );
  const hasNotePasswordStore = useSelector(
    (state: RootState) => state.auth.isCommonPasswordSet,
  );
  const [hasNotePassword, setHasNotePassword] = useState(hasNotePasswordStore);

  useFocusEffect(
    useCallback(() => {
      setHasNotePassword(hasNotePasswordStore);
    }, [hasNotePasswordStore]),
  );
  const [lockNote] = useNoteLockMutation();
  const [noteBackground, setNoteBackground] = useState<string>("#f5f5f5");
  const { isConnected } = useNetInfo();
  const [textToolBarVisibility, setTextToolBarVisibility] = useState(false);
  function toggleTextToolBarVisibility() {
    setTextToolBarVisibility(!textToolBarVisibility);
  }
  const [headerModalVisibility, setHeaderModalVisibility] = useState(false);
  function toggleHeaderModalVisibility() {
    setHeaderModalVisibility(!headerModalVisibility);
  }
  const [isColorPaletteVisible, setIsColorPaletteVisible] = useState(false);
  function toggleColorPaletteVisibility() {
    setIsColorPaletteVisible(!isColorPaletteVisible);
  }
  const [showReminder, setShowReminder] = useState(false);
  function toggleReminderVisibility() {
    setShowReminder(!showReminder);
  }
  const [showSummary, setShowSummary] = useState(false);
  function toggleShowSummary() {
    setShowSummary(!showSummary);
  }

  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  function toggleShowAttachmentOptions() {
    setShowAttachmentOptions(!showAttachmentOptions);
  }

  const [saveApi] = useSaveNoteMutation();
  const [editApi] = useUpdateMutation();
  const [deleteApi] = useDeleteMutation();
  const [uploadApi] = useUploadFileMutation();

  const noteId = route?.params?.id;
  const { data: NotesData, refetch } = useGetNoteByIdQuery(
    { id: String(noteId) },
    { skip: !noteId, refetchOnFocus: true },
  );
  const [AISummary] = useAiSummaryMutation();
  const [aiSummary, setAiSummary] = useState("");
  async function generateSummary() {
    try {
      const response = await AISummary({ id: String(noteId) });
      setAiSummary(response.data.summary);
    } catch (error) {
      console.log("Error generating AI summary: ", error);
    }
  }
  useFocusEffect(
    useCallback(() => {
      if (noteId) {
        refetch();
      }
    }, [noteId]),
  );

  const isEditMode = Boolean(noteId);
  const [notes, setNotes] = useState({
    id: "",
    title: "",
    content: "",
    isPasswordProtected: false,
    isReminderSet: null,
    backgroundColor: "#ffffff",
  });

  const { isNotesUnlocked } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (notes.isPasswordProtected && !isNotesUnlocked) {
      Toast.show({ text1: "Note is locked" });
      navigation.goBack();
    }
  }, [isNotesUnlocked, notes.isPasswordProtected]);

  useEffect(() => {
    if (!NotesData?.data) return;
    setNotes({
      id: NotesData.data.id ?? "",
      title: NotesData.data.title ?? "",
      content: NotesData.data.content ?? "",
      isPasswordProtected: NotesData.data.isPasswordProtected ?? false,
      isReminderSet: NotesData.data.isReminderSet ?? null,
      backgroundColor: NotesData.data.backgroundColor ?? "#f5f5f5",
    });

    richText.current?.setContentHTML(NotesData.data.content ?? "");
    if (Array.isArray(NotesData.data.filePaths)) {
      setExistingFiles(NotesData.data.filePaths);
    }
  }, [NotesData]);

  useEffect(() => {
    if (NotesData?.data?.backgroundColor) {
      setNoteBackground(NotesData.data.backgroundColor);
    }
  }, [NotesData]);

  const [isLocked, setIsLocked] = useState(false);
  const [isReminder, setIsReminder] = useState(false);

  useEffect(() => {
    if (NotesData?.data?.isReminderSet) {
      setIsReminder(true);
    }
  }, [NotesData?.data?.isReminderSet]);

  useEffect(() => {
    if (NotesData?.data?.isPasswordProtected !== undefined) {
      setIsLocked(!!NotesData.data.isPasswordProtected);
    }
  }, [NotesData?.data?.isPasswordProtected]);

  async function toggleLock() {
    if (!noteId) {
      Toast.show({ text1: "Save note before locking" });
      return;
    }

    if (!hasNotePassword) {
      navigation.navigate("NotesPassword", {
        id: String(noteId),
        title: notes.title ?? "",
        content: notes.content ?? "",
      });
      return;
    }

    try {
      const response = await lockNote({ id: String(noteId) }).unwrap();
      console.log(response);
      setIsLocked(true);
      setNotes((prev) => ({
        ...prev,
        isPasswordProtected: isLocked,
      }));

      Toast.show({ text1: "Note locked" });
    } catch (error: any) {
      Toast.show({ text1: "Failed to lock note" });
      console.log(error);
    }
  }

  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);
  async function pickFile() {
    try {
      const result = await pick({
        allowMultiSelection: true,
        allowVirtualFiles: true,
      });
      setFiles((prev) => [...prev, ...result]);
    } catch (error) {
      console.log("Error uploading file", error);
    }
  }

  async function uploadFilesToBackend(files: DocumentPickerResponse[]) {
    const uploadedPaths: string[] = [];

    for (const file of files) {
      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        type: file.type ?? "application/octet-stream",
        name: file.name ?? "file",
      } as any);

      const response = await uploadApi(formData).unwrap();
      console.log(response.data.path, "ygjhligkhjluk");
      uploadedPaths.push(response.data.path);
    }

    return uploadedPaths;
  }

  async function handleSave(navigate = true) {
    try {
      let filePaths: string[] = [];

      if (isConnected && files?.length > 0) {
        filePaths = await uploadFilesToBackend(files);
        console.log(filePaths, "fugfr");
      }

      const localId = await saveToLocalDB(
        isConnected ? "synced" : "pending",
        filePaths,
      );

      if (isConnected) {
        const payload = {
          id: localId,
          title: notes?.title ?? "",
          content: notes?.content ?? "",
          isPasswordProtected: isLocked,
          backgroundColor: noteBackground ?? "#ffffff",
          isReminderSet: isReminder,
          filePaths: filePaths ?? [],
        };
        console.log(payload, "fjilufhilrughirghlotighoj;ltohjg;lrsthgj;lo");
        if (isEditMode) {
          await editApi(payload).unwrap();
        } else {
          await saveApi(payload).unwrap();
        }
      }
      console.log("saved");
      if (navigate) navigation.goBack();
    } catch (error: any) {
      console.log("Save error:", error?.data ?? error);
    }
  }

  async function handleDelete(navigate = true) {
    try {
      if (!noteId) {
        Toast.show({
          text1: "Empty note can’t be deleted",
        });
        return;
      }
      if (!userId) throw new Error("userID is not correct");
      await db
        .delete(notesTable)
        .where(and(eq(notesTable.id, noteId), eq(notesTable.userId, userId)));

      if (isConnected) {
        await deleteApi({ id: noteId }).unwrap();
      }
      Toast.show({
        text1: "Deleted",
      });
      if (navigate) navigation.goBack();
    } catch (error) {
      console.log("Delete error:", error);
    }
  }

  async function saveToLocalDB(status: SyncStatus, filePaths: string[] = []) {
    await createTable();
    if (!userId) {
      throw new Error("userId is required to create a note");
    }

    const id = noteId ?? uuidv4();

    await db
      .insert(notesTable)
      .values({
        id,
        userId,
        title: notes.title,
        content: notes.content,
        updatedAt: new Date().toISOString(),
        isPasswordProtected: isLocked ? 1 : 0,
        isReminderSet: isReminder ? 1 : 0,
        syncStatus: status,
        filePaths: JSON.stringify(filePaths),
      })
      .onConflictDoUpdate({
        target: notesTable.id,
        set: {
          title: notes.title,
          content: notes.content,
          updatedAt: new Date().toISOString(),
          isPasswordProtected: isLocked ? 1 : 0,
          isReminderSet: isReminder ? 1 : 0,
          syncStatus: status,
          filePaths: JSON.stringify(filePaths),
        },
      });

    return id;
  }

  // function handleLock() {
  //   Alert.alert(
  //     "Set Password First",
  //     "You will have to set password for notes first",
  //     [
  //       {
  //         text: "Cancel",
  //         style: "cancel",
  //       },
  //       {
  //         text: "Set Password",
  //         onPress: () =>
  //           navigation.navigate("NotesPassword", {
  //             id: String(noteId),
  //             title: notes.title ?? " ",
  //             content: notes.content ?? " ",
  //           }),
  //       },
  //     ],
  //     { cancelable: true },
  //   );
  // }

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  async function openFile(file: DocumentPickerResponse) {
    try {
      if (file.type?.startsWith("image")) {
        setPreviewImage(file.uri);
        return;
      }

      await FileViewer.open(file.uri, {
        showOpenWithDialog: true,
      });
    } catch (error) {
      Alert.alert("Unable to open file");
      console.log("Open file error:", error);
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: noteBackground,
      },
      headerTransparent: false,
      headerShadowVisible: false,
      headerRight: () => (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleSave()}>
            <Entypo
              name="check"
              size={30}
              color="#5757f8"
              style={styles.headerButton}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, noteBackground, handleSave]);
  const debouncedNotes = useDebounce(
    {
      title: notes.title,
      content: notes.content,
      isPasswordProtected: isLocked,
      backgroundColor: noteBackground,
      isReminderSet: isReminder,
      filePaths: files,
    },
    4000,
  );

  useEffect(() => {
    if (!debouncedNotes.title || !debouncedNotes.content) return;
    handleSave(false);
  }, [debouncedNotes.title, debouncedNotes.content]);

  const richText = useRef<RichEditor | null>(null);
  return (
    <KeyboardAvoidingView
      style={[styles.all]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { backgroundColor: noteBackground }]}>
        <TextInput
          placeholder="Title"
          placeholderTextColor="#5c5c5c"
          style={styles.title}
          value={notes.title}
          onChangeText={(value) =>
            setNotes((prev) => ({ ...prev, title: value }))
          }
        />
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: noteBackground,
          }}
          style={{ backgroundColor: noteBackground }}
        >
          <View
            style={[
              styles.editorContainer,
              { backgroundColor: noteBackground },
            ]}
          >
            <RichEditor
              ref={richText}
              initialContentHTML={notes.content}
              onChange={(val) =>
                setNotes((prev) => ({ ...prev, content: val }))
              }
              editorStyle={{
                backgroundColor: noteBackground,
                color: "#000",
              }}
              initialHeight={600}
              placeholder="Type Here..."
            />
          </View>
        </ScrollView>
        <View style={{ padding: 10 }}>
          {files.length > 0 && (
            <FlatList
              data={files}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => openFile(item)}
                  activeOpacity={0.7}
                  style={{
                    padding: 8,
                    marginRight: 10,
                    borderRadius: 8,
                    backgroundColor: "#EDEDED",
                  }}
                >
                  <Text numberOfLines={1} style={{ maxWidth: 100 }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 10, color: "#666" }}>
                    {((item.size ?? 0) / 1024).toFixed(1)} KB
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        {previewImage && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.9)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <TouchableOpacity
              style={{ position: "absolute", top: 40, right: 20 }}
              onPress={() => setPreviewImage(null)}
            >
              <AntDesign name="close" size={28} color="#fff" />
            </TouchableOpacity>

            <Image
              source={{ uri: previewImage }}
              style={{ width: "90%", height: "80%", resizeMode: "contain" }}
            />
          </View>
        )}

        {existingFiles.length > 0 && (
          <FlatList
            data={existingFiles}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.match(/\.(jpg|jpeg|png|webp)$/)) {
                    setPreviewImage(item);
                  } else {
                    Linking.openURL(item);
                  }
                }}
                style={{
                  padding: 8,
                  marginRight: 10,
                  borderRadius: 8,
                  backgroundColor: "#DDE3FF",
                }}
              >
                <Text numberOfLines={1} style={{ maxWidth: 120 }}>
                  {item.split("/").pop()}
                </Text>
                <Text style={{ fontSize: 10, color: "#555" }}>Saved file</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {textToolBarVisibility && (
          <View style={styles.modal}>
            <RichToolbar
              editor={richText}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.checkboxList,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.setStrikethrough,
              ]}
              iconSize={28}
              selectIconTint="#000"
              iconTint="#5757f8"
              style={styles.toolbar}
            />
            <TouchableOpacity
              onPress={toggleTextToolBarVisibility}
              style={{
                alignSelf: "center",
                backgroundColor: "#E0E7FF",
                borderRadius: 25,
                padding: 2,
              }}
            >
              <AntDesign name="close" size={24} style={[styles.optionIcon]} />
            </TouchableOpacity>
          </View>
        )}

        {headerModalVisibility && (
          <View style={{ position: "absolute", bottom: 80, right: 20 }}>
            <View style={styles.headerMenu}>
              {isLocked ? (
                <TouchableOpacity
                  style={styles.touchables}
                  onPress={toggleLock}
                  disabled={isGuest}
                >
                  <AntDesign name="unlock" color="#5757f8" size={24} />
                  <Text style={styles.touchableText}>Unlock</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.touchables}
                  onPress={() => {
                    toggleLock();
                  }}
                  disabled={isGuest}
                >
                  <AntDesign name="lock" color="#5757f8" size={24} />
                  <Text style={styles.touchableText}>Lock</Text>
                </TouchableOpacity>
              )}
              {isEditMode && (
                <TouchableOpacity
                  style={styles.touchables}
                  onPress={toggleReminderVisibility}
                  disabled={isGuest}
                >
                  <Ionicons
                    color="#5757f8"
                    size={24}
                    name="notifications-outline"
                  />
                  <Text style={styles.touchableText}>Reminder</Text>
                </TouchableOpacity>
              )}

              {isEditMode && (
                <TouchableOpacity
                  style={styles.touchables}
                  onPress={() => handleDelete()}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color="#5757f8"
                  />
                  <Text style={styles.touchableText}>Delete</Text>
                </TouchableOpacity>
              )}
              <View />
            </View>
          </View>
        )}

        {isColorPaletteVisible && (
          <BackgroundColor
            selectedColor={noteBackground}
            onSelectColor={(color) => {
              setNoteBackground(color);
              setNotes((prev) => ({ ...prev, backgroundColor: color }));
            }}
          />
        )}
        <View style={styles.line} />

        {showReminder ? (
          <Reminder
            id={String(noteId)}
            onClose={() => setShowReminder(false)}
            onReminderSet={async (id) => {
              setIsReminder(true);
              if (isConnected && id) {
                await editApi({
                  id,
                  title: notes.title,
                  content: notes.content,
                  isPasswordProtected: isLocked ? 1 : 0,
                  backgroundColor: noteBackground,
                  isReminderSet: true,
                }).unwrap();
              }
            }}
          />
        ) : null}

        {showSummary ? (
          <Summary
            id={notes.id}
            onClose={() => setShowSummary(false)}
            data={aiSummary}
          />
        ) : null}

        {/* Options bottom  */}
        {!textToolBarVisibility ? (
          <View style={styles.options}>
            <TouchableOpacity
              onPress={toggleTextToolBarVisibility}
              style={styles.optionButton}
            >
              <MaterialCommunityIcons
                name="format-text"
                size={24}
                style={styles.optionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={pickFile}>
              <Entypo name="attachment" size={24} style={styles.optionIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                toggleShowSummary();
                generateSummary();
              }}
            >
              <Ionicons
                name="sparkles-outline"
                size={24}
                style={styles.optionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={toggleColorPaletteVisibility}
            >
              <Ionicons
                name="color-palette-outline"
                size={24}
                style={styles.optionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleHeaderModalVisibility}
              style={styles.optionButton}
            >
              {headerModalVisibility ? (
                <AntDesign name="close" size={24} style={styles.optionIcon} />
              ) : (
                <MaterialIcons
                  name="more-vert"
                  size={24}
                  style={styles.optionIcon}
                />
              )}
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}
