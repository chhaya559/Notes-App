import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "./style";
import {
  EnrichedTextInputInstance,
  EnrichedTextInput,
  OnChangeStateEvent,
} from "react-native-enriched";
import {
  useDeleteMutation,
  useSetMutation,
  useUpdateMutation,
} from "@redux/api/noteApi";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/types";

type CreateNoteProps = NativeStackScreenProps<RootStackParamList, "CreateNote">;
export default function CreateNote({
  navigation,
  route,
}: Readonly<CreateNoteProps>) {
  const ref = useRef<EnrichedTextInputInstance>(null);
  const [styleState, setStyleState] = useState<OnChangeStateEvent | null>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [notes, setNotes] = useState({
    token: token,
    title: "",
    content: "",
    isLocked: false,
    reminder: null,
  });
  console.log(notes, "notesnotesnotesnotes");
  const [saveApi] = useSetMutation();
  const [editApi] = useUpdateMutation();
  const [deleteApi] = useDeleteMutation();
  const noteId = route?.params?.id;
  const isEditMode = Boolean(noteId);

  useEffect(() => {
    if (isEditMode) {
      setNotes((prev) => ({
        ...prev,
        title: route.params?.title ?? "",
        content: route.params?.content ?? "",
      }));
      ref.current?.setValue?.(route.params?.content ?? "");
    }
  }, [isEditMode]);
  async function handle() {
    try {
      if (isEditMode) {
        await editApi({
          title: notes.title,
          content: notes.content,
          id: route.params.id,
        }).unwrap();
        console.log("Updated successfully");
      } else {
        const response = await saveApi(notes).unwrap();
        console.log(response);
        console.log("Saved successfully");
      }
    } catch (error) {
      console.log("Error saving note : ", error);
    }
    navigation.replace("Dashboard");
  }
  async function handleDelete() {
    try {
      const response = await deleteApi({ id: route.params.id }).unwrap();
      console.log(response);
    } catch (error) {
      console.log("seg", error);
    }
    navigation.replace("Dashboard");
  }

  return (
    <KeyboardAvoidingView style={styles.all}>
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <TouchableOpacity style={styles.pressables}>
            <Text style={styles.pressablesText}>Lock</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressables}>
            <Text style={styles.pressablesText}>Reminder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressables}>
            <Text style={styles.pressablesText}>AI Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressables} onPress={handle}>
            <Text style={styles.pressablesText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressables} onPress={handleDelete}>
            <Text style={styles.pressablesText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.line} />

        <TextInput
          placeholder="Title"
          style={styles.title}
          value={notes.title}
          onChangeText={(value) =>
            setNotes((prev) => ({ ...prev, title: value }))
          }
        />
        <View style={styles.editorContainer}>
          <ScrollView contentContainerStyle={{ height: 550 }}>
            <EnrichedTextInput
              ref={ref}
              onChangeState={(e) => setStyleState(e.nativeEvent)}
              onChangeText={(e) => {
                const text = e.nativeEvent.value;
                setNotes((prev) => ({ ...prev, content: text }));
              }}
              onChangeHtml={(val) => {
                console.log(val, "sdfndhsbfnhjdsbfjhdsb");
              }}
              style={styles.input}
            />
          </ScrollView>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => ref.current?.toggleBold()}
          >
            <Text style={[styles.buttonText, styles.bold]}>B</Text>
          </TouchableOpacity>
          {/* title={styleState?.bold ? "B" : "B"} */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => ref.current?.toggleItalic()}
          >
            <Text style={[styles.italic, styles.buttonText]}>I</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => ref.current?.toggleUnderline()}
          >
            <Text style={[styles.buttonText]}>U</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => ref.current?.toggleOrderedList()}
          >
            <Text style={[styles.buttonText]}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => ref.current?.toggleUnorderedList()}
          >
            <Text style={[styles.buttonText]}>.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
