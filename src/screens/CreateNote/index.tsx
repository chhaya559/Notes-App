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
import { useFocusEffect } from "@react-navigation/native";
import Summary from "@components/atoms/Summary";
import useDebounce from "src/debounce/debounce";
import FileViewer from "react-native-file-viewer";
import useTheme from "@hooks/useTheme";
import useStyles from "@hooks/useStyles";
import { pendingNotes } from "src/db/pendingNotes/schema";
import SaveNoteButton from "@components/atoms/SaveNoteButton";

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
  const [uploadApi, { isLoading: fileUploading }] = useUploadFileMutation();
  const [deleteFile] = useRemoveFileMutation();

  const [notes, setNotes] = useState({
    id: "",
    title: route?.params?.title ?? "",
    content: route?.params?.content ?? "",
    isPasswordProtected: false,
    isReminderSet: null,
    isLocked: false,
  });
  const [localNoteId, setLocalNoteId] = useState<string | null>(
    route?.params?.id ?? null,
  );
  const [noteId, setNoteId] = useState(localNoteId);
  const { data: NotesData } = useGetNoteByIdQuery(
    { id: String(noteId) },
    { skip: !noteId, refetchOnFocus: true },
  );

  console.log(NotesData, "dadatataadata");

  // useEffect(() => {
  //   async function loadFilesFromLocal() {
  //     if (!noteId) return;

  //     const local = await db
  //       .select()
  //       .from(notesTable)
  //       .where(eq(notesTable.id, noteId));

  //     if (local.length > 0) {
  //       const filePaths: any = JSON.parse(local[0].filePaths || "[]");

  //       setExistingFiles(filePaths);
  //     }
  //   }

  //   if (!isConnected) {
  //     loadFilesFromLocal();
  //   }
  // }, [noteId, isConnected]);
  useEffect(() => {
    if (fileUploading) {
      console.log("dkeohfalfnakl");
    }
  }, [fileUploading]);
  const [AISummary, { isLoading: summaryLoading }] = useAiSummaryMutation();
  const [aiSummary, setAiSummary] = useState(" ");

  async function generateSummary() {
    try {
      if (!isConnected) {
        Toast.show({
          text1: "You need internet to generate AI summary",
        });
      }
      const response = await AISummary({ id: String(noteId) });
      if (response?.error?.data?.message) {
        Toast.show({
          text1: response.error.data.message,
        });
      }
      setAiSummary(response.data.summary);
    } catch (error) {
      console.log("Error generating AI summary: ", error);
    }
  }

  const isEditMode = !!noteId;

  const notesRef = useRef<any>(null);
  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);
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

    setTimeout(() => {
      richText.current?.setContentHTML(NotesData.data.content ?? "");
    }, 200);
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

  async function pickFile() {
    try {
      const result = await pick({
        allowMultiSelection: true,
        allowVirtualFiles: true,
        type: [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
          "image/webp",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
      });

<<<<<<< HEAD
      let uploadedFiles: { path: string; file: DocumentPickerResponse }[] = [];

      if (isConnected) {
        uploadedFiles = await uploadFilesToBackend(result);
        if (uploadedFiles.length > 0) {
          Toast.show({ text1: "File uploaded" });
        }
      }

      const newExistingFiles = [...existingFiles];
      const newLocalFiles = [];

      for (const item of (isConnected ? uploadedFiles : result.map((f) => ({ path: f.uri, file: f })))) {
        const isImage = item.file.type?.startsWith("image") || item.path.match(/\.(jpg|jpeg|png|webp|gif)$/i);

        if (isConnected) {
          newExistingFiles.push(item.path);
        } else if (!isImage) {
          newLocalFiles.push(item.file);
        }

        if (isImage) {
          const imgMarkup = `<img src="${item.path}" alt="${item.file.name}" style="width: 120px; height: 120px; border-radius: 8px;" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({type: 'imageClick', url: '${item.path}'}))" />&nbsp;`;
          richText.current?.insertHTML(imgMarkup);
        } else {
          if (isConnected) {
            newLocalFiles.push(item.file);
          }
        }
      }

      setFiles((prev) => [...prev, ...newLocalFiles]);

      if (isConnected) {
        setExistingFiles(newExistingFiles);
      }

      if (isConnected && noteId) {
        await editApi({
          id: noteId,
          title: notesRef.current?.title ?? "",
          content: notesRef.current?.content ?? "",
          isPasswordProtected: notesRef.current?.isPasswordProtected,
          isLocked: notesRef.current?.isLocked,
          isReminderSet: isReminder,
          filePaths: newExistingFiles,
        }).unwrap();
=======
      const imageFiles = result.filter((f) => f.type?.startsWith("image"));
      console.log(imageFiles, "imageimage");
      const documentFiles = result.filter((f) => !f.type?.startsWith("image"));

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          richText.current?.insertHTML(
            `<img 
   src="${file.uri}" 
   style="
     width:500px;
     height:300px;
     max-width:100%;
     object-fit:contain;
     border-radius:8px;
     margin-top:8px;
   "
   onclick="window.ReactNativeWebView.postMessage(this.src)"
 />`,
          );
        });

        if (isConnected) {
          uploadFilesToBackend(imageFiles).then((uploadedPaths) => {
            console.log(uploadedPaths, "uploaded");
            setExistingFiles((prev) => [...prev, ...uploadedPaths]);
          });
        } else {
          setExistingFiles((prev) => [
            ...prev,
            ...imageFiles.map((f) => f.uri),
          ]);
        }
      }

      if (documentFiles.length > 0) {
        if (isConnected) {
          const uploadedDocs = await uploadFilesToBackend(documentFiles);

          setExistingFiles((prev) => [...prev, ...uploadedDocs]);
        } else {
          setFiles((prev) => [...prev, ...documentFiles]);
        }
>>>>>>> df266aa (minor)
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function removeFile(file: any) {
    setFiles((prev) => prev.filter((item) => item.uri !== file.uri));
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
        if (response) {
          Toast.show({
            text1: response.message,
            type: "success",
          });
        }
        console.log(response, "rererereere");
        uploadedFiles.push({ path: response.data.path, file });
      } catch (err: any) {
        Toast.show({
          text1: err?.data?.message || "File not supported",
        });
        continue;
      }
    }

    return uploadedFiles;
  }

  const [offlineId, setOfflineId] = useState(null);

  async function handleSave(navigate = true) {
    console.log("saving");
    const isNetConnected = isConnected;
    try {
      if (navigate) {
        if (!notesRef.current?.title && !notesRef.current?.content) {
          Toast.show({
            text1: "Your note needs at least a title or content",
          });
          return;
        }
        if (!notesRef.current?.title) {
          notesRef.current.title = "New Note";
        }
      }

      console.log(isEditMode, "mmode");

      const filePaths = existingFiles;
      const id = noteId ?? localNoteId ?? uuidv4();
      if (!noteId) setNoteId(id);
      if (!localNoteId) setLocalNoteId(id);

      const payload = {
        id: id,
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
            id: newId,
            userId,
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
          const id = saveToPendingDB(1, filePaths);
          console.log(id);
          setOfflineId(await id);
        }
      }
      if (navigate) {
        console.log("goback");
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
      if (isConnected) {
        await deleteApi({ id: noteId }).unwrap();
        await db.delete(notesTable).where(eq(notesTable.id, noteId));
      } else {
        await pendingDb
          .insert(pendingNotes)
          .values({
            id: noteId,
            userId,
            syncStatus: 3,
          })
          .onConflictDoUpdate({
            target: pendingNotes.id,
            set: {
              syncStatus: 3,
            },
          });
        await db.delete(notesTable).where(eq(notesTable.id, noteId));
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
          onPress: () => void handleDelete(),
        },
      ],
      { cancelable: true },
    );
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
    return id;
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SaveNoteButton handleSave={handleSave} />,
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
    const hasContent =
      debouncedNotes.title?.trim() ||
      debouncedNotes.content?.replaceAll(/<(.|\n)*?>/g, "").trim();

    if (!hasContent) return;
    handleSave(false);
  }, [debouncedNotes.title, debouncedNotes.content]);

  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, 200);
  }, []);

  const richText = useRef<RichEditor | null>(null);

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
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: keyboardHeight + 40,
          }}
        >
          <View style={[dynamicStyles.editorContainer]}>
            <RichEditor
              ref={richText}
              initialContentHTML={notes.content}
              onChange={(val) =>
                setNotes((prev) => ({ ...prev, content: val }))
              }
<<<<<<< HEAD
              onMessage={(msg: any) => {
                try {
                  const data = typeof msg === "string" ? JSON.parse(msg) : msg;
                  const payload = typeof data.data === "string" ? JSON.parse(data.data) : (data.data || data);
                  if (payload.type === 'imageClick' && payload.url) {
                    setPreviewImage(payload.url);
                  } else if (data.type === 'imageClick' && data.url) {
                    setPreviewImage(data.url);
                  }
                } catch (e) {}
=======
              onMessage={(event) => {
                const uri = event.nativeEvent.data;

                openFile({
                  uri,
                  type: "image/jpeg",
                });
>>>>>>> df266aa (minor)
              }}
              editorStyle={{
                backgroundColor: Colors.background,
                color: Colors.textPrimary,
                caretColor: Colors.primary,
                placeholderColor: Colors.placeholder,
              }}
              initialFocus={true}
              // initialHeight={500}
              placeholder="Type Here..."
            />
          </View>
        </ScrollView>
        <View style={{ padding: 10 }}>
<<<<<<< HEAD
          {files.filter(f => !f.type?.startsWith("image")).length > 0 ? (
            <FlatList
              data={files.filter(f => !f.type?.startsWith("image"))}
=======
          {combinedFiles.length > 0 && (
            <FlatList
              data={combinedFiles}
>>>>>>> df266aa (minor)
              keyExtractor={(item, index) => index.toString()}
              horizontal
              bounces={false}
              renderItem={({ item }) => {
                return (
                  <View style={dynamicStyles.filesWrap}>
                    <TouchableOpacity
                      onPress={() => openFile(item)}
                      style={dynamicStyles.fileContainer}
                    >
<<<<<<< HEAD
                      <AntDesign name="close" size={12} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            existingFiles.filter(item => !item.match(/\.(jpg|jpeg|png|webp|gif)$/i) || !(notes.content || '').includes(item)).length > 0 && (
              <FlatList
                data={existingFiles.filter(item => !item.match(/\.(jpg|jpeg|png|webp|gif)$/i) || !(notes.content || '').includes(item))}
                keyExtractor={(item, index) => `${item}-${index}`}
                horizontal
                renderItem={({ item }) => {
                  const isImage = item.match(/\.(jpg|jpeg|png|webp)$/);
=======
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        size={40}
                        color={Colors.iconPrimary}
                      />
>>>>>>> df266aa (minor)

                      <Text style={{ color: Colors.textSecondary }}>
                        {item.name}
                      </Text>

                      <TouchableOpacity
                        style={dynamicStyles.close}
                        onPress={() => {
                          if (item.isExisting) {
                            DeleteFilefromNote(item.uri);
                          } else {
                            removeFile(item);
                          }
                        }}
                      >
                        <AntDesign name="close" size={12} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                );
              }}
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
              style={[
                dynamicStyles.optionButton,
                { opacity: isEditMode && !isGuest ? 1 : 0.5 },
              ]}
              onPress={() => {
                generateSummary();
                handleToggle("summary");
                richText.current?.dismissKeyboard();
                Keyboard.dismiss();
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
                { opacity: isEditMode && !isGuest ? 1 : 0.5 },
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
