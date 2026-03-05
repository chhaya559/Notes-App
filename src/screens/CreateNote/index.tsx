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
  Keyboard,
  AppState,
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
import Modal from "react-native-modal";
import { RootState } from "@redux/store";
import { eq } from "drizzle-orm";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Reminder from "@components/atoms/Reminder";
import Summary from "@components/atoms/Summary";
import SaveNoteButton from "@components/atoms/SaveNoteButton";
import { useFocusEffect } from "@react-navigation/native";
import useDebounce from "src/debounce/debounce";
import FileViewer from "react-native-file-viewer";
import useTheme from "@hooks/useTheme";
import useStyles from "@hooks/useStyles";
import { pendingNotes } from "src/db/pendingNotes/schema";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";

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
  const [offlineId, setOfflineId] = useState(null);
  const [isGuest, setIsGuest] = useState(isGuestFromStore);

  useFocusEffect(
    useCallback(() => {
      setIsGuest(isGuestFromStore);
    }, [isGuestFromStore]),
  );

  const [noteLoaded, setNoteLoaded] = useState(false);
  const { isConnected } = useNetInfo();

  const [activeOption, setActiveOption] = useState<
    "text" | "attachment" | "summary" | "reminder" | null
  >(null);

  const handleToggle = (
    option: "text" | "attachment" | "summary" | "reminder",
  ) => {
    setActiveOption((prev) => (prev === option ? null : option));
  };
  const notesRef = useRef<any>(null);
  const noteIdRef = useRef<string | null>(route?.params?.id ?? null);
  const handleSaveRef = useRef<any>(null);
  const isDeletingRef = useRef(false);
  const [saveApi] = useSaveNoteMutation();
  const [editApi] = useUpdateMutation();
  const [uploadApi] = useUploadFileMutation();
  const [deleteFile] = useRemoveFileMutation();

  const [notes, setNotes] = useState({
    id: "",
    title: route?.params?.title ?? "",
    content: route?.params?.content ?? "",
    isPasswordProtected: false,
    isReminderSet: null,
    isLocked: false,
  });

  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  const [localNoteId, setLocalNoteId] = useState<string | null>(
    route?.params?.id ?? null,
  );

  const [noteId, setNoteId] = useState(localNoteId);

  const { data: NotesData } = useGetNoteByIdQuery(
    { id: String(noteId) },
    { skip: !noteId, refetchOnFocus: true },
  );

  const [AISummary, { isLoading: summaryLoading }] = useAiSummaryMutation();

  const [aiSummary, setAiSummary] = useState(" ");

  async function generateSummary() {
    try {
      console.log(isConnected);
      if (!isConnected) {
        handleToggle("summary");
        Toast.show({
          text1: "You need internet to generate AI summary",
          type: "info",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
        return;
      }

      const response: any = await AISummary({ id: String(noteId) });

      if (response?.error?.data?.message) {
        Toast.show({
          text1: response.error.data.message,
          type: "info",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
        handleToggle("summary");
        return;
      }

      setAiSummary(response?.data?.summary);
    } catch (error) {
      console.log("Error generating AI summary:", error);
    }
  }

  const isEditMode = !!noteId;
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);

  const shownOfflinePopup = useRef(false);

  useEffect(() => {
    const isOffline = isConnected === false;
    if (isOffline && !shownOfflinePopup.current) {
      const hasImageInContent = notes?.content?.includes("<img") || false;

      const hasImages =
        existingFiles.length > 0 || files.length > 0 || hasImageInContent;

      if (hasImages) {
        shownOfflinePopup.current = true;

        Toast.show({
          text1: "Restore Internet",
          text2: "This note contains images. Connect to internet to view them.",
        });
      }
    }

    if (isConnected) {
      shownOfflinePopup.current = false;
    }
  }, [isConnected, notes.content, existingFiles, files]);

  const richText = useRef<RichEditor | null>(null);

  useEffect(() => {
    if (!NotesData?.data) return;

    const data = NotesData.data;

    setNotes({
      id: data.id ?? "",
      title: data.title ?? "",
      content: data.content ?? "",
      isPasswordProtected: data.isPasswordProtected ?? false,
      isLocked: data.isLocked ?? false,
      isReminderSet: data.isReminderSet ?? null,
    });

    setExistingFiles(data.filePaths || []);
    richText.current?.setContentHTML(data.content ?? "");
    setNoteLoaded(true);
  }, [NotesData]);

  useEffect(() => {
    if (!route?.params) return;

    setNotes((prev) => ({
      ...prev,
      id: route.params.id ?? "",
      title: route.params.title ?? "",
      content: route.params.content ?? "",
    }));

    setNoteId(route.params.id ?? null);
    setLocalNoteId(route.params.id ?? null);
    noteIdRef.current = route.params.id ?? null;
    richText.current?.setContentHTML(route.params.content ?? "");
  }, [route.params]);

  const [isReminder, setIsReminder] = useState(false);

  useEffect(() => {
    if (NotesData?.data?.isReminderSet) {
      setIsReminder(true);
    }
  }, [NotesData?.data?.isReminderSet]);

  async function DeleteFilefromNote(filePath: string) {
    console.log(filePath, "filepathfilepath");
    try {
      await deleteFile({
        id: noteId,
        fileUrl: filePath,
      }).unwrap();

      Toast.show({
        text1: "File removed",
        type: "success",
        swipeable: false,
        onPress: () => Toast.hide(),
      });
      setExistingFiles((prev) => prev.filter((item) => item !== filePath));
    } catch (error) {
      console.log("Error removing file", error);
      Toast.show({
        text1: "Failed to remove file",
        type: "error",
        swipeable: false,
        onPress: () => Toast.hide(),
      });
    }
  }

  async function saveToPendingDB(
    status: any,
    filePaths: string[] = [],
    offlineId?: any,
  ) {
    const id = offlineId ?? noteId ?? uuidv4();

    const title = notesRef.current?.title ?? "";
    const content = notesRef.current?.content ?? "";

    await pendingDb
      .insert(pendingNotes)
      .values({
        id: String(id),
        userId: String(userId),
        title,
        content,
        updatedAt: new Date().toISOString(),
        filePaths: JSON.stringify(filePaths),
        syncStatus: status,
      })
      .onConflictDoUpdate({
        target: pendingNotes.id,
        set: {
          title,
          content,
          updatedAt: new Date().toISOString(),
          syncStatus: status,
          filePaths: JSON.stringify(filePaths),
        },
      });
    console.log("Pending notes saved");
    return id.toString();
  }

  async function uploadFilesToBackend(files: DocumentPickerResponse[]) {
    const uploadedFiles: { path: string; file: DocumentPickerResponse }[] = [];

    for (const file of files) {
      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        type: file.type ?? "application/octet-stream",
        name: file.name ?? "file",
      } as any);

      try {
        const response = await uploadApi(formData).unwrap();

        console.log(response, "upload response");

        if (response?.data?.path) {
          Toast.show({
            text1: response.message || "File uploaded successfully",
            type: "success",
            swipeable: false,
            onPress: () => Toast.hide(),
          });

          uploadedFiles.push({
            path: response.data.path,
            file,
          });
        }
      } catch (err: any) {
        Toast.show({
          text1: err?.data?.message || "File not supported",
          type: "error",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
      }
    }

    return uploadedFiles;
  }

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  async function openFile(file: any) {
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

  async function pickFile() {
    if (!isConnected) {
      Toast.show({
        text1: "Please connect to internet to upload image",
      });
      return;
    }
    let permissionResult;
    if (Platform.OS === "android") {
      if (Platform.Version >= 33) {
        permissionResult = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      } else {
        permissionResult = await request(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
      }
    } else {
      permissionResult = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
    }
    switch (permissionResult) {
      case RESULTS.GRANTED:
        console.log("You can use the media images");
        break;
      case RESULTS.DENIED:
        Toast.show({
          text1: "Permission denied to access images",
          type: "info",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
        console.log("Permission denied to access images");
        return;
      case RESULTS.UNAVAILABLE:
        Toast.show({
          text1: "Feature not available on this device",
          type: "info",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
        console.log("Feature not available on this device.");
        return;
    }

    const result = await pick({
      allowMultiSelection: false,
      type: ["image/*"],
    });

    const file = result[0];

    const isImage = file.type?.startsWith("image");

    if (!isImage) return;

    if (isConnected) {
      const uploaded = await uploadFilesToBackend([file]);

      if (uploaded.length === 0) {
        Toast.show({
          text1: "Upload Failed",
          type: "error",
          swipeable: false,
          onPress: () => Toast.hide(),
        });
        return;
      }

      Toast.show({
        text1: "File Uploaded Successfully",
        type: "success",
        swipeable: false,
        onPress: () => Toast.hide(),
      });

      const path = uploaded[0].path;

      const imgMarkup = `
   <img 
   src="${path}"
   style="
   width:400px;
   height:400px;
   border-radius:12px;
   object-fit:cover;
     display: block;
      margin: 10px 0;
   "/>
   `;

      richText.current?.insertHTML(imgMarkup);

      setTimeout(() => {
        richText.current?.blurContentEditor?.();
      }, 100);
      setExistingFiles((prev) => [...prev, path]);
    } else {
      Toast.show({
        text1: "Saved Offline",
        type: "success",
        swipeable: false,
        onPress: () => Toast.hide(),
      });

      const imgMarkup = `
   <img 
   src="${file.uri}"
   style="
   width:400px;
   height:400px;
   border-radius:12px;
   object-fit:cover;
     display: block;
      margin: 10px 0;
   "/>
   `;

      richText.current?.insertHTML(imgMarkup);

      setFiles((prev) => [...prev, file]);
    }
  }
  const saveCompletedRef = useRef(false);

  async function handleSave(navigate = true, autoSave?: boolean) {
    if (isDeletingRef.current) return;
    if (!notesRef.current.content && !notesRef.current.title) return;
    if (saveCompletedRef.current && navigate === false) {
      return;
    }
    console.log("saving");

    const isNetConnected = isConnected;
    try {
      if (!autoSave) {
        if (!notesRef.current?.title.trim()) {
          notesRef.current.title = "New Note";
        }
        if (!notesRef.current?.title && !notesRef.current?.content) {
          Toast.show({
            text1: "Your note needs at least a title or content",
            type: "info",
            swipeable: false,
            onPress: () => Toast.hide(),
          });
          return;
        }
      }
      if (navigate) {
        if (!notesRef.current?.title.trim() || existingFiles.length > 0) {
          notesRef.current.title = "New Note";
        }
        if (!notesRef.current?.title && !notesRef.current?.content) {
          Toast.show({
            text1: "Your note needs at least a title or content",
            type: "info",
            swipeable: false,
            onPress: () => Toast.hide(),
          });
          return;
        }
      }

      console.log(isEditMode, "mmode");

      const filePaths = existingFiles;
      const id = noteId ?? localNoteId ?? noteIdRef.current ?? uuidv4();
      noteIdRef.current = id;
      if (!noteId) setNoteId(id);
      if (!localNoteId) setLocalNoteId(id);

      const payload = {
        id: id,
        userId: String(userId),
        title: notesRef.current?.title,
        content: notesRef.current?.content ?? "",
        isPasswordProtected: notesRef.current?.isPasswordProtected,
        isLocked: notesRef.current?.isLocked,
        isReminderSet: isReminder,
        filePaths: filePaths ?? [],
      };

      if (isEditMode || noteId) {
        if (isNetConnected) {
          const res = await editApi(payload).unwrap();
          await pendingDb.delete(pendingNotes).where(eq(pendingNotes.id, id));
          await db
            .update(notesTable)
            .set({
              title: payload.title,
              content: payload.content,
              updatedAt: new Date().toISOString(),
              filePaths: JSON.stringify(filePaths ?? []),
            })
            .where(eq(notesTable.id, id));
          console.log(res);
        } else {
          saveToPendingDB(2, filePaths, offlineId);
        }
      } else {
        if (isNetConnected) {
          const res = await saveApi(payload).unwrap();
          const newId = res?.data?.id;

          await db.insert(notesTable).values({
            id: String(newId),
            userId: String(userId),
            title: payload.title,
            content: payload.content,
            updatedAt: new Date().toISOString(),
            filePaths: JSON.stringify(filePaths ?? []),
            syncStatus: "synced",
          });
          await pendingDb.delete(pendingNotes).where(eq(pendingNotes.id, id));
          console.log(res, "save response");
          setNoteId(res?.data?.id);
        } else {
          const id = await saveToPendingDB(1, filePaths);
          console.log(id, "ididididid");
          setOfflineId(id);
        }
      }
      if (navigate) {
        saveCompletedRef.current = true;
        console.log("goback");
        navigation.goBack();
      }
    } catch (error: any) {
      if (error?.data?.errors?.length) {
        Toast.show({
          type: "error",
          text1: error.data.errors[0],
          swipeable: false,
          onPress: () => Toast.hide(),
        });
      } else if (error?.data.message) {
        Toast.show({
          type: "error",
          text1: error?.data.message,
          swipeable: false,
          onPress: () => Toast.hide(),
        });
      }
      console.log("Save error:", error);
    }
  }

  const renderSaveButton = useCallback(
    () => <SaveNoteButton handleSave={handleSave} />,
    [handleSave],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: renderSaveButton,
    });
  }, [navigation, renderSaveButton]);

  useEffect(() => {
    handleSaveRef.current = handleSave;
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (handleSaveRef.current) {
        handleSaveRef.current(false);
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        if (handleSaveRef.current) {
          handleSaveRef.current(false);
        }
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const debouncedNotes = useDebounce(
    {
      title: notes.title,
      content: notes.content,
      isPasswordProtected: notes.isPasswordProtected,
      isReminderSet: isReminder,
      filePaths: files,
    },
    2000,
  );

  useEffect(() => {
    if (noteId && !noteLoaded) return;

    const hasContent =
      debouncedNotes.title?.trim() ||
      debouncedNotes.content?.replaceAll(/<(.|\n)*?>/g, "").trim();

    if (!hasContent) return;

    handleSave(false, true);
  }, [debouncedNotes.title, debouncedNotes.content]);

  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, 200);
  }, []);

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
  const [deleteApi] = useDeleteMutation();

  const combinedFiles = [
    ...(existingFiles || []).map((uri) => ({
      uri,
      name: uri.split("/").pop(),
      isExisting: true,
    })),
    ...(files || []).map((file) => ({
      ...file,
      isExisting: false,
    })),
  ].filter((file) => !/\.(jpg|jpeg|png|webp|gif)$/i.test(file.uri));

  async function handleDelete() {
    try {
      isDeletingRef.current = true;
      if (isConnected) {
        await deleteApi({ id: notesRef.current.id }).unwrap();
        await db
          .delete(notesTable)
          .where(eq(notesTable.id, notesRef.current.id));
      } else {
        await pendingDb
          .insert(pendingNotes)
          .values({
            id: String(notesRef.current.id),
            userId: String(userId),
            title: "",
            content: "",
            updatedAt: new Date().toISOString(),
            filePaths: "[]",
            syncStatus: 3,
          })
          .onConflictDoUpdate({
            target: pendingNotes.id,
            set: {
              syncStatus: 3,
              updatedAt: new Date().toISOString(),
            },
          });
        console.log(
          "pendingdelete",
          await pendingDb.select().from(pendingNotes),
        );
        await db
          .delete(notesTable)
          .where(eq(notesTable.id, notesRef.current.id));
        console.log("notes in local", await db.select().from(notesTable));
      }
      navigation.goBack();
      Toast.show({
        text1: "Note Deleted",
        type: "success",
        swipeable: false,
        onPress: () => Toast.hide(),
      });
    } catch (error: any) {
      console.log("Delete error:", error);
      Toast.show({
        text1: error?.data?.message,
        type: "error",
        swipeable: false,
        onPress: () => Toast.hide(),
      });
    }
  }

  function confirmDelete() {
    Alert.alert(
      "Delete Note",
      "This action is permanent. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            handleDelete();
          },
        },
      ],
      { cancelable: true },
    );
  }

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
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: keyboardHeight + 40,
          }}
        >
          <View style={dynamicStyles.editorContainer}>
            <RichEditor
              ref={richText}
              useContainer={true}
              initialFocus={true}
              initialContentHTML={route?.params?.content || ""}
              initialHeight={500}
              onChange={(val) =>
                setNotes((prev) => ({ ...prev, content: val }))
              }
              onCursorPosition={(scrollY) => {
                scrollRef.current?.scrollTo({
                  y: scrollY - 120,
                  animated: true,
                });
              }}
              editorStyle={{
                backgroundColor: Colors.background,
                color: Colors.textPrimary,
                caretColor: Colors.primary,
                placeholderColor: Colors.placeholder,
              }}
              placeholder="Type Here..."
            />
          </View>
        </ScrollView>
        <View style={{ padding: 10 }}>
          {combinedFiles.length > 0 && (
            <FlatList
              data={combinedFiles}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              bounces={false}
              renderItem={({ item }) => (
                <View style={dynamicStyles.filesWrap}>
                  <TouchableOpacity
                    onPress={() => openFile(item)}
                    style={dynamicStyles.fileContainer}
                  >
                    <MaterialCommunityIcons
                      name="file-document-outline"
                      size={40}
                      color={Colors.iconPrimary}
                    />

                    <Text
                      numberOfLines={1}
                      style={{
                        color: Colors.textSecondary,
                        marginTop: 5,
                        fontSize: 12,
                      }}
                    >
                      {item.name}
                    </Text>

                    <TouchableOpacity
                      style={{ position: "absolute", top: 5, right: 5 }}
                      onPress={() =>
                        item.isExisting ? DeleteFilefromNote(item.uri) : null
                      }
                    >
                      <AntDesign name="close" size={12} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
        {previewImage && (
          <Modal
            isVisible={Boolean(previewImage)}
            onBackdropPress={() => setPreviewImage(null)}
          >
            <View>
              <Image
                source={{ uri: previewImage }}
                style={{ width: "90%", height: "90%", resizeMode: "contain" }}
              />
            </View>
          </Modal>
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
              onPress={(action: string) => {
                richText.current?.sendAction(action, "", undefined, true);
              }}
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
              Toast.show({
                text1: "Reminder set successfully",
                type: "success",
              });

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
            isLoading={summaryLoading}
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
                bottom: Math.max(keyboardHeight, 0),
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
              onPress={() => {
                generateSummary();
                handleToggle("summary");
                richText.current?.dismissKeyboard();
                Keyboard.dismiss();
              }}
              style={[
                dynamicStyles.optionButton,
                { opacity: isEditMode && !isGuest ? 1 : 0.5 },
              ]}
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
                { opacity: isEditMode && !isGuest ? 1 : 0.5 },
              ]}
              onPress={() => {
                if (isConnected) {
                  handleToggle("reminder");
                  return;
                }

                Toast.show({
                  text1: "You need internet connection to set reminder",
                  swipeable: false,
                });
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
              onPress={() => confirmDelete()}
              disabled={!isEditMode}
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
