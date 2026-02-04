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
  useSetMutation,
  useUpdateMutation,
} from "@redux/api/noteApi";
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
import BackgroundColor from "../../components/molecules/BackgroundColor";
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
import { launchImageLibrary, Asset } from "react-native-image-picker";
import useDebounce from "src/debounce/debounce";

type CreateNoteProps = NativeStackScreenProps<RootStackParamList, "CreateNote">;

export default function CreateNote({
  navigation,
  route,
}: Readonly<CreateNoteProps>) {
  const userId = useSelector((state: RootState) => state.auth.token);
  const [noteBackground, setNoteBackground] = useState<string>("#f5f5f5");
  const { isConnected } = useNetInfo();
  const [textToolBarVisibility, setTextToolBarVisibility] = useState(false);
  const [isNoteSaved, setIsNoteSaved] = useState(false);
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
  const [images, setImages] = useState<Asset[]>([]);

  const [saveApi] = useSetMutation();
  const [editApi] = useUpdateMutation();
  const [deleteApi] = useDeleteMutation();

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
  }, [NotesData]);
  useEffect(() => {
    if (NotesData?.data?.backgroundColor) {
      setNoteBackground(NotesData.data.backgroundColor);
    }
  }, [NotesData]);
  useEffect(() => {
    if (!route.params?.unlockUntil) return;

    const remaining = route.params.unlockUntil - Date.now();
    if (remaining <= 0) return lock();

    const timer = setTimeout(lock, remaining);
    return () => clearTimeout(timer);
  }, [route.params?.unlockUntil]);

  function lock() {
    Toast.show({ text1: "Note locked" });
    navigation.navigate("Dashboard");
  }

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

  function toggleLock() {
    setIsLocked(!isLocked);
  }

  async function pickImage() {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 5,
    });
    if (result.assets) {
      Toast.show({
        text1: "Images uploaded successfully",
      });
      setImages(result.assets);
    } else if (result.errorMessage) {
      Toast.show({
        text1: "Error uploading image",
      });
    }
  }

  async function handleSave(navigate = true) {
    try {
      const localId = await saveToLocalDB(isConnected ? "synced" : "pending");

      if (isConnected) {
        if (isEditMode) {
          await editApi({
            id: localId,
            title: notes.title,
            content: notes.content,
            isPasswordProtected: isLocked,
            backgroundColor: noteBackground,
            isReminderSet: isReminder,
            imagePaths: images,
          }).unwrap();
        } else {
          const response = await saveApi({
            id: localId,
            title: notes.title,
            content: notes.content,
            isPasswordProtected: isLocked,
            backgroundColor: noteBackground,
            isReminderSet: isReminder,
            imagePaths: images,
          }).unwrap();
        }
      }
      if (navigate) navigation.goBack();
      setIsNoteSaved(true);
    } catch (error) {
      if (
        error?.data?.message?.includes(
          "Guest users cannot password protect notes.",
        )
      ) {
        Toast.show({
          text1: "Password-protected notes aren’t available for guest users.",
          text2: "Register yourself to use this feature",
        });
      } else if (
        error?.data?.message.includes(
          "Password required to lock for the first time",
        )
      ) {
        Alert.alert(
          "Set Password for Notes first",
          "Go to Profile section to set password for notes",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Set Password",
              style: "default",
              onPress: () =>
                navigation.navigate("NotesPassword", { id: String(noteId) }),
            },
          ],
          { cancelable: true },
        );
      }
      console.log("Save error:", error);
    }
  }

  async function handleDelete() {
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
      navigation.goBack();
    } catch (error) {
      console.log("Delete error:", error);
    }
  }

  async function saveToLocalDB(status: SyncStatus) {
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
        },
      });

    return id;
  }

  function handleAlert() {
    if (isNoteSaved) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      "Save Note first",
      "You will lose your note data without saving",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Set Password",
          onPress: () =>
            navigation.navigate("NotesPassword", { id: String(noteId) }),
        },
      ],
      { cancelable: true },
    );
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
          <TouchableOpacity onPress={handleSave}>
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

  const richText = useRef<RichEditor | null>(null);
  const debouncedNotes = useDebounce(
    {
      title: notes.title,
      content: notes.content,
      isPasswordProtected: isLocked,
      backgroundColor: noteBackground,
      isReminderSet: isReminder,
      imagePaths: images,
    },
    400,
  );

  // useEffect(() => {
  //   if (!debouncedNotes.title || !debouncedNotes.content) return;
  //   handleSave(false);
  // }, [debouncedNotes]);

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
        <View style={{ marginTop: 10 }}>
          {images?.length > 0 && (
            <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: 80,
                    height: 80,
                  }}
                />
              )}
            />
          )}
        </View>

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
              {notes.isPasswordProtected ? (
                <TouchableOpacity
                  style={styles.touchables}
                  onPress={toggleLock}
                >
                  <AntDesign name="unlock" color="#5757f8" size={24} />
                  <Text style={styles.touchableText}>Unlock</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.touchables}
                  onPress={toggleLock}
                >
                  <AntDesign name="lock" color="#5757f8" size={24} />
                  <Text style={styles.touchableText}>Lock</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.touchables}
                onPress={toggleReminderVisibility}
              >
                <Ionicons
                  color="#5757f8"
                  size={24}
                  name="notifications-outline"
                />
                <Text style={styles.touchableText}>Reminder</Text>
              </TouchableOpacity>

              {isEditMode && (
                <TouchableOpacity
                  style={styles.touchables}
                  onPress={handleDelete}
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
            id={noteId}
            onClose={() => setShowReminder(false)}
            onReminderSet={async (id) => {
              setIsReminder(true);
              if (isConnected && id) {
                await editApi({
                  id,
                  title: notes.title,
                  content: notes.content,
                  isPasswordProtected: isLocked,
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
            <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
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
