import React, { useEffect, useRef, useState } from "react";
import {
  TextInput,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Text,
  Modal,
} from "react-native";
import styles from "./style";
import { EnrichedTextInputInstance } from "react-native-enriched";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import {
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
import BackgroundColor from "@components/Molecules/BackgroundColor";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Reminder from "@components/atoms/Reminder";
import AISummary from "@components/atoms/AISummary";

type CreateNoteProps = NativeStackScreenProps<RootStackParamList, "CreateNote">;

export default function CreateNote({
  navigation,
  route,
}: Readonly<CreateNoteProps>) {
  const userId = useSelector((state: RootState) => state.auth.token);
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
  const [notes, setNotes] = useState({
    title: "",
    content: "",
    isPasswordProtected: false,
    reminder: null,
    backgroundColor: "#ffffff",
  });
  const [saveApi] = useSetMutation();
  const [editApi] = useUpdateMutation();
  const [deleteApi] = useDeleteMutation();

  const noteId = route?.params?.id;
  const { data: NotesData } = useGetNoteByIdQuery({ id: noteId });
  console.log(NotesData, "notesdata");
  const isEditMode = Boolean(noteId);

  useEffect(() => {
    if (!NotesData?.data) return;
    setNotes({
      title: NotesData.data.title ?? "",
      content: NotesData.data.content ?? "",
      isPasswordProtected: NotesData.data.isPasswordProtected ?? false,
      reminder: NotesData.data.reminder ?? null,
      backgroundColor: NotesData.data.backgroundColor ?? "#f5f5f5",
    });

    richText.current?.setContentHTML(NotesData.data.content ?? "");
  }, [NotesData]);
  useEffect(() => {
    if (NotesData?.data?.backgroundColor) {
      setNoteBackground(NotesData.data.backgroundColor);
    }
  }, [NotesData]);

  async function handleSave() {
    try {
      if (isEditMode) {
        if (isConnected) {
          await editApi({
            id: noteId,
            title: notes.title.trim(),
            content: notes.content,
            isPasswordProtected: notes.isPasswordProtected,
          }).unwrap();
        }
        await saveToLocalDB("synced");

        navigation.goBack();
        return;
      }

      const localId = await saveToLocalDB(isConnected ? "synced" : "pending");

      if (isConnected) {
        await saveApi({
          id: localId,
          title: notes.title.trim(),
          content: notes.content,
          isPasswordProtected: notes.isPasswordProtected,
          backgroundColor: notes.backgroundColor ?? "#f5f5f5",
        }).unwrap();
      }

      navigation.goBack();
    } catch (error) {
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
  //header
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
        isPasswordProtected: notes.isPasswordProtected ? 1 : 0,
        reminder: notes.reminder ?? null,
        syncStatus: status,
        backgroundColor: notes.backgroundColor ?? "#f5f5f5",
      })
      .onConflictDoUpdate({
        target: notesTable.id,
        set: {
          title: notes.title,
          content: notes.content,
          updatedAt: new Date().toISOString(),
          isPasswordProtected: notes.isPasswordProtected ? 1 : 0,
          reminder: notes.reminder,
          syncStatus: status,
          backgroundColor: notes.backgroundColor ?? "#f5f5f5",
        },
      });
    return id;
  }
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: noteBackground,
      },
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
  }, [navigation, handleSave]);
  const richText = useRef<RichEditor | null>(null);
  return (
    <KeyboardAvoidingView
      style={[styles.all]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { backgroundColor: noteBackground }]}>
        <View style={styles.upperContainer}>
          {/* <TouchableOpacity
                style={styles.pressables}
                onPress={handleDelete}
              >
                <Text style={styles.pressablesText}>Delete</Text>
              </TouchableOpacity> */}
        </View>

        <View style={styles.line} />

        <TextInput
          placeholder="Title"
          placeholderTextColor="#5c5c5c"
          style={styles.title}
          value={notes.title}
          onChangeText={(value) =>
            setNotes((prev) => ({ ...prev, title: value }))
          }
        />
        <ScrollView bounces={false} style={{ backgroundColor: noteBackground }}>
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
              editorStyle={{ backgroundColor: noteBackground, color: "#000" }}
              initialHeight={600}
              placeholder="Type Here..."
            />
          </View>
        </ScrollView>
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
            {notes.isPasswordProtected == true ? (
              <TouchableOpacity style={styles.touchables}>
                <AntDesign name="unlock" color="#5757f8" size={24} />
                <Text style={styles.touchableText}>Lock</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.touchables}>
                <AntDesign name="lock" color="#5757f8" size={24} />
                <Text style={styles.touchableText}>Unlock</Text>
              </TouchableOpacity>
            )}
            {/* <View style={styles.line} /> */}
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
            {/* <View style={styles.line} /> */}

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
      {/* color palette */}
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
      {/* reminder */}
      {showReminder ? (
        <Reminder onClose={() => setShowReminder(false)} />
      ) : null}
      {/* ai summary */}
      {showSummary ? <AISummary onClose={() => setShowSummary(false)} /> : null}
      // {/* options  */}
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
          <TouchableOpacity style={styles.optionButton}>
            <Entypo name="attachment" size={24} style={styles.optionIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={toggleShowSummary}
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
          {/* <TouchableOpacity style={styles.optionButton}>
          <Entypo name="lock" size={24} style={styles.optionIcon} />
        </TouchableOpacity> */}
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
    </KeyboardAvoidingView>
  );
}
