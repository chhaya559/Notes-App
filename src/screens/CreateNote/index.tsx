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
  AppState,
  Keyboard,
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
  useRemoveFileMutation,
  useSaveNoteMutation,
  useUpdateMutation,
  useUploadFileMutation,
} from "@redux/api/noteApi";
import { DocumentPickerResponse, pick } from "@react-native-documents/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";
import { useNetInfo } from "@react-native-community/netinfo";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { notesTable } from "src/db/schema";
import Toast from "react-native-toast-message";
import { db, pendingDb } from "src/db/notes";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { and, eq } from "drizzle-orm";
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
import useTheme from "@hooks/useTheme";
import useStyles from "@hooks/useStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { pendingNotes } from "src/db/pendingNotes/schema";

type CreateNoteProps = NativeStackScreenProps<RootStackParamList, "CreateNote">;

export default function CreateNote({
  navigation,
  route,
}: Readonly<CreateNoteProps>) {
  const userId = useSelector((state: RootState) => state.auth.token);
  const isGuestFromStore = useSelector(
    (state: RootState) => state.auth.isGuest,
  );
  const { Colors } = useTheme();
  const { dynamicStyles } = useStyles(styles);
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
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (isSavedRef.current) {
        return;
      }
      if (nextState.match(/inactive|background/)) {
        console.log("listener");
        handleSave(false);
      }
      appState.current = nextState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      if (isSavedRef.current) return;

      const isEmpty =
        !notesRef.current?.title?.trim() &&
        !notesRef.current?.content?.replaceAll(/<(.|\n)*?>/g, "").trim();

      if (isEmpty) return;

      handleSave(false);
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setHasNotePassword(hasNotePasswordStore);
    }, [hasNotePasswordStore]),
  );
  const { isConnected } = useNetInfo();

  const [activeOption, setActiveOption] = useState<
    "text" | "attachment" | "summary" | "reminder" | null
  >(null);
  const handleToggle = (
    option: "text" | "attachment" | "summary" | "reminder",
  ) => {
    setActiveOption((prev) => (prev === option ? null : option));
  };

  const [saveApi] = useSaveNoteMutation();
  const [editApi] = useUpdateMutation();
  const [deleteApi] = useDeleteMutation();
  const [uploadApi] = useUploadFileMutation();
  const [deleteFile] = useRemoveFileMutation();

  const [notes, setNotes] = useState({
    id: "",
    title: route?.params?.title,
    content: route?.params?.content,
    isPasswordProtected: false,
    isReminderSet: null,
    isLocked: false,
  });
  const [localNoteId, setLocalNoteId] = useState<string | null>(
    route?.params?.id ?? null,
  );
  const [noteId, setNoteId] = useState(localNoteId);
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

  const isEditMode = !!noteId;

  const notesRef = useRef<any>(null);
  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  useEffect(() => {
    if (!NotesData?.data) return;
    setNotes({
      id: NotesData.data.id ?? "",
      title: NotesData.data.title ?? "",
      content: NotesData.data.content ?? "",
      isPasswordProtected: NotesData.data.isPasswordProtected ?? false,
      isLocked: NotesData.data.isLocked ?? false,
      isReminderSet: NotesData.data.isReminderSet ?? null,
    });

    richText.current?.setContentHTML(NotesData.data.content ?? "");
    if (Array.isArray(NotesData.data.filePaths)) {
      setExistingFiles(NotesData.data.filePaths);
    }
  }, [NotesData]);

  const [isReminder, setIsReminder] = useState(false);

  useEffect(() => {
    if (NotesData?.data?.isReminderSet) {
      setIsReminder(true);
    }
  }, [NotesData?.data?.isReminderSet]);

  const isDeletingRef = useRef(false);
  const isSavedRef = useRef(false);

  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);

  async function pickFile() {
    try {
      const result = await pick({
        allowMultiSelection: true,
        allowVirtualFiles: true,
      });

      setFiles((prev) => [...prev, ...result]);

      let uploadedPaths: string[] = [];

      if (isConnected) {
        uploadedPaths = await uploadFilesToBackend(result);
      }

      const updatedPaths = [...existingFiles, ...uploadedPaths];

      setExistingFiles(updatedPaths);

      if (isConnected && noteId) {
        await editApi({
          id: noteId,
          title: notesRef.current?.title ?? "",
          content: notesRef.current?.content ?? "",
          isPasswordProtected: notesRef.current?.isPasswordProtected,
          isLocked: notesRef.current?.isLocked,
          isReminderSet: isReminder,
          filePaths: updatedPaths,
        }).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function removeFile(filePath: any) {
    setFiles((prev) => prev.filter((item) => item !== filePath));
  }

  async function DeleteFilefromNote(filePath: string) {
    console.log(filePath, "filepathfilepath");
    try {
      await deleteFile({
        id: noteId,
        fileUrl: filePath,
      }).unwrap();

      Toast.show({ text1: "File removed" });
      setExistingFiles((prev) => prev.filter((item) => item !== filePath));
    } catch (error) {
      console.log("Error removing file", error);
      Toast.show({ text1: "Failed to remove file" });
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

      try {
        const response = await uploadApi(formData).unwrap();

        uploadedPaths.push(response.data.path);
      } catch (err: any) {
        Toast.show({
          text1: err?.data?.message || "File not supported",
        });
        continue;
      }
    }

    return uploadedPaths;
  }

  async function handleSave(navigate = true) {
    try {
      if (navigate) {
        if (!notes.title && !notes.content) {
          Toast.show({
            text1: "Your note needs at least a title or content",
          });
          return;
        }
        if (!notes.title) {
          setNotes((prev) => ({ ...prev, title: "New Note" }));
        }
      }
      console.log("heyy");

      const filePaths = existingFiles;
      const id = noteId ?? uuidv4();

      if (!localNoteId) {
        setLocalNoteId(id);
      }

      const payload = {
        id: id,
        title: notesRef.current?.title ?? "",
        content: notesRef.current?.content ?? "",
        isPasswordProtected: notesRef.current?.isPasswordProtected,
        isLocked: notesRef.current?.isLocked,
        isReminderSet: isReminder,
        filePaths: filePaths ?? [],
      };
      if (isEditMode || noteId) {
        if (isConnected) {
          await editApi(payload).unwrap();
        } else {
          saveToPendingDB(filePaths, 2);
        }
      } else {
        if (isConnected) {
          const res = await saveApi(payload).unwrap();
          setNoteId(res?.data?.id);
          console.log(res?.data?.id);
        } else {
          saveToPendingDB(filePaths, 1);
        }
      }
      isSavedRef.current = true;
      if (navigate) {
        isSavedRef.current = true;
        navigation.goBack();
      }
    } catch (error: any) {
      if (error?.data?.errors?.length) {
        Toast.show({
          type: "error",
          text1: error.data.errors[0],
        });
      } else if (error?.data.message) {
        Toast.show({
          type: "error",
          text1: error?.data.message,
        });
      }
      console.log("Save error:", error);
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
      console.log("note deleted from local db");
      isDeletingRef.current = true;
      if (isConnected) {
        await deleteApi({ id: noteId }).unwrap();
      }
      Toast.show({
        text1: "Deleted",
      });
      if (navigate) navigation.goBack();
    } catch (error) {
      console.log("Delete error:", error);
      Toast.show({
        text1: "Not able to delete this",
      });
    }
  }

  async function alertDelete() {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(),
        },
      ],
      { cancelable: true },
    );
  }

  async function saveToPendingDB(filePaths: string[] = [], status: number) {
    const id = noteId ?? uuidv4();

    console.log("inside pending");

    await pendingDb
      .insert(pendingNotes)
      .values({
        id,
        userId,
        title: notes.title,
        content: notes.content,
        updatedAt: new Date().toISOString(),
        filePaths: JSON.stringify(filePaths),
        syncStatus: status,
      })
      .onConflictDoUpdate({
        target: pendingNotes.id,
        set: {
          title: notes.title,
          content: notes.content,
          updatedAt: new Date().toISOString(),
          syncStatus: status,
          filePaths: JSON.stringify(filePaths),
        },
      });

    console.log("saved to pending notes");

    const data = await pendingDb.select().from(pendingNotes);
    console.log("Pending notes:", data);
  }

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
      headerRight: () => (
        <View style={dynamicStyles.header}>
          <TouchableOpacity onPress={() => handleSave()}>
            <Entypo
              name="check"
              size={30}
              color={Colors.iconPrimary}
              style={dynamicStyles.headerButton}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleSave]);

  const debouncedNotes = useDebounce(
    {
      title: notes.title,
      content: notes.content,
      isPasswordProtected: notes.isPasswordProtected,
      isReminderSet: isReminder,
      filePaths: files,
    },
    4000,
  );

  useEffect(() => {
    if (!debouncedNotes.title && !debouncedNotes.content) return;
    handleSave(false);
  }, [debouncedNotes.title, debouncedNotes.content]);
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, 100);
  }, []);

  const richText = useRef<RichEditor | null>(null);
  const insets = useSafeAreaInsets();

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  });

  return (
    <KeyboardAvoidingView
      style={[
        dynamicStyles.all,
        {
          flex: 1,
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[dynamicStyles.container]}>
        <TextInput
          placeholder="Title"
          placeholderTextColor={Colors.placeholder}
          style={dynamicStyles.title}
          value={notes.title}
          onChangeText={(value) =>
            setNotes((prev) => ({ ...prev, title: value }))
          }
          selectionColor={Colors.primary}
          cursorColor={Colors.primary}
        />
        <ScrollView
          bounces={false}
          ref={scrollRef}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: keyboardHeight + 20,
          }}
        >
          <View style={[dynamicStyles.editorContainer]}>
            <RichEditor
              ref={richText}
              initialContentHTML={notes.content}
              onChange={(val) =>
                setNotes((prev) => ({ ...prev, content: val }))
              }
              editorStyle={{
                backgroundColor: Colors.background,
                color: Colors.textPrimary,
                caretColor: Colors.primary,
              }}
              initialFocus={true}
              // initialHeight={570}
              placeholder="Type Here..."
            />
          </View>
        </ScrollView>
        <View style={{ padding: 10 }}>
          {files.length > 0 ? (
            <FlatList
              data={files}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              bounces={false}
              // renderItem={({ item }) => (
              //   <TouchableOpacity
              //     onPress={() => openFile(item)}
              //     activeOpacity={0.7}
              //     style={dynamicStyles.fileContainer}
              //   >
              //     <Text style={{ color: Colors.textSecondary }}>
              //       {item.name}
              //     </Text>
              //     <Text style={dynamicStyles.imageSize}>
              //       {((item.size ?? 0) / 1024).toFixed(1)} KB
              //     </Text>
              //     <TouchableOpacity
              //       style={dynamicStyles.close}
              //       onPress={() => removeFile(item)}
              //     >
              //       <AntDesign
              //         name="close"
              //         size={12}
              //         color={Colors.iconMuted}
              //       />
              //     </TouchableOpacity>
              //   </TouchableOpacity>
              // )}
              renderItem={({ item }) => {
                const isImage = item.type?.startsWith("image");

                return (
                  <TouchableOpacity
                    onPress={() => openFile(item)}
                    style={dynamicStyles.fileContainer}
                  >
                    {isImage ? (
                      <Image
                        source={{ uri: item.uri }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 6,
                          marginBottom: 4,
                        }}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        size={40}
                        color={Colors.iconPrimary}
                      />
                    )}

                    <Text style={{ color: Colors.textSecondary }}>
                      {item.name}
                    </Text>

                    <Text style={dynamicStyles.imageSize}>
                      {((item.size ?? 0) / 1024).toFixed(1)} KB
                    </Text>

                    <TouchableOpacity
                      style={dynamicStyles.close}
                      onPress={() => removeFile(item)}
                    >
                      <AntDesign name="close" size={12} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            existingFiles.length > 0 && (
              <FlatList
                data={existingFiles}
                keyExtractor={(item, index) => `${item}-${index}`}
                horizontal
                renderItem={({ item }) => {
                  const isImage = item.match(/\.(jpg|jpeg|png|webp)$/);

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (isImage) {
                          setPreviewImage(item);
                        } else {
                          Linking.openURL(item);
                        }
                      }}
                      style={dynamicStyles.existingFile}
                    >
                      {isImage ? (
                        <Image
                          source={{ uri: item }}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 6,
                            marginBottom: 6,
                          }}
                        />
                      ) : (
                        <>
                          <MaterialCommunityIcons
                            name="file-document-outline"
                            size={40}
                            color={Colors.iconPrimary}
                          />
                          <Text>{item.split("/").pop()}</Text>
                        </>
                      )}

                      <Text style={{ fontSize: 10, color: Colors.textMuted }}>
                        Saved file
                      </Text>

                      <TouchableOpacity
                        style={dynamicStyles.close}
                        onPress={() => DeleteFilefromNote(item)}
                      >
                        <AntDesign
                          name="close"
                          size={16}
                          color={Colors.iconMuted}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                }}
              />
            )
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
              // backgroundColor: "rgba(0,0,0,0.9)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <TouchableOpacity
              style={{ position: "absolute", top: 40, right: 20 }}
              onPress={() => setPreviewImage(null)}
            >
              <AntDesign name="close" size={28} color={Colors.iconPrimary} />
            </TouchableOpacity>

            <Image
              source={{ uri: previewImage }}
              style={{ width: "90%", height: "80%", resizeMode: "contain" }}
            />
          </View>
        )}

        {activeOption == "text" && (
          <View
            style={[
              dynamicStyles.modal,
              {
                position: "absolute",
                left: 0,
                right: 0,
                bottom: keyboardHeight,
                backgroundColor: Colors.surface,
              },
            ]}
          >
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
              selectedIconTint={Colors.textPrimary}
              iconTint={Colors.primary}
              style={dynamicStyles.toolbar}
            />
            <TouchableOpacity
              onPress={() => setActiveOption(null)}
              style={{
                alignSelf: "center",
                // backgroundColor: Colors.mutedIcon,
                borderRadius: 25,
                padding: 2,
              }}
            >
              <AntDesign
                name="close"
                size={24}
                style={[dynamicStyles.optionIcon]}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={dynamicStyles.line} />

        {/* show reminder */}
        {activeOption == "reminder" ? (
          <Reminder
            id={String(noteId)}
            onClose={() => setActiveOption(null)}
            onReminderSet={async (id) => {
              setIsReminder(true);
              setActiveOption(null);
              if (isConnected && id) {
                await editApi({
                  id,
                  title: notes.title,
                  content: notes.content,
                  isPasswordProtected: notes.isPasswordProtected ? 1 : 0,
                  isReminderSet: true,
                }).unwrap();
              }
            }}
          />
        ) : null}

        {/* show summary */}
        {activeOption == "summary" ? (
          <Summary
            id={notes.id}
            onClose={() => setActiveOption(null)}
            data={aiSummary}
          />
        ) : null}

        {/* Options bottom  */}
        {activeOption == "text" ? null : (
          <View
            style={[
              dynamicStyles.options,
              {
                position: "absolute",
                left: 0,
                right: 0,
                bottom: keyboardHeight > 0 ? keyboardHeight : 0,
                backgroundColor: Colors.surface,
                paddingBottom: 10,
                paddingTop: 10,
                zIndex: 100,
                elevation: 100,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleToggle("text")}
              style={dynamicStyles.optionButton}
            >
              <MaterialCommunityIcons
                name="format-text"
                size={24}
                style={dynamicStyles.optionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={dynamicStyles.optionButton}
              onPress={() => {
                pickFile();
                handleToggle("attachment");
              }}
            >
              <Entypo
                name="attachment"
                size={24}
                style={dynamicStyles.optionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                dynamicStyles.optionButton,
                { opacity: isEditMode || isGuest ? 1 : 0.5 },
              ]}
              onPress={() => {
                generateSummary();
                handleToggle("summary");
              }}
              disabled={!isEditMode || isGuest}
            >
              <Ionicons
                name="sparkles-outline"
                size={24}
                style={[dynamicStyles.optionIcon]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                dynamicStyles.optionButton,
                { opacity: isEditMode || isGuest ? 1 : 0.5 },
              ]}
              onPress={() => {
                handleToggle("reminder");
              }}
              disabled={isGuest || !isEditMode}
            >
              <Ionicons
                style={dynamicStyles.optionIcon}
                size={24}
                name="notifications-outline"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                dynamicStyles.optionButton,
                { opacity: isEditMode ? 1 : 0.5 },
              ]}
              onPress={() => alertDelete()}
              disabled={isGuest || !isEditMode}
            >
              <MaterialIcons
                name="delete-outline"
                size={24}
                style={dynamicStyles.optionIcon}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
