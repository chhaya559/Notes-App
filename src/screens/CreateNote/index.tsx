import React, { useRef, useState } from "react";
import {
  Pressable,
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  Button,
  ScrollView,
} from "react-native";
import styles from "./style";
import {
  EnrichedTextInputInstance,
  EnrichedTextInput,
  OnChangeStateEvent,
} from "react-native-enriched";
import { saveNote } from "src/db/saveNote";

export default function CreateNote() {
  function handle() {
    saveNote({
      title: notes.title,
      body: notes.body,
      isLocked: notes.isLocked,
      reminder: notes.reminder,
    });
  }
  const ref = useRef<EnrichedTextInputInstance>(null);
  const [styleState, setStyleState] = useState<OnChangeStateEvent | null>();
  const [notes, setNotes] = useState({
    title: "",
    body: "",
    isLocked: false,
    reminder: null,
  });
  return (
    <KeyboardAvoidingView style={styles.all}>
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <Pressable style={styles.pressables}>
            <Text style={styles.pressablesText}>Lock</Text>
          </Pressable>
          <Pressable style={styles.pressables}>
            <Text style={styles.pressablesText}>Reminder</Text>
          </Pressable>
          <Pressable style={styles.pressables}>
            <Text style={styles.pressablesText}>AI Summary</Text>
          </Pressable>
          <Pressable style={styles.pressables} onPress={handle}>
            <Text style={styles.pressablesText}>Save</Text>
          </Pressable>
        </View>

        <View style={styles.line} />

        <TextInput
          placeholder="Note Title"
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
                setNotes((prev) => ({ ...prev, body: text }));
              }}
              style={styles.input}
            />
          </ScrollView>
        </View>
        <View style={styles.buttons}>
          <View style={styles.button}>
            {/* <Button
              title={styleState?.bold ? "B" : "B"}
              color={styleState?.bold ? "#000" : "#000"}
              onPress={() => ref.current?.toggleBold()}
            /> */}
            <Text style={{ fontSize: 20, fontWeight: "800" }}>B</Text>
          </View>
          <View style={styles.button}>
            <Button
              title={styleState?.italic ? "I" : "I"}
              color={styleState?.bold ? "#000" : "#bebebeff"}
              onPress={() => ref.current?.toggleItalic()}
            />
          </View>
          <View style={styles.button}>
            <Button
              title={styleState?.underline ? "U" : "U"}
              color={styleState?.bold ? "#000" : "#bebebeff"}
              onPress={() => ref.current?.toggleUnderline()}
            />
          </View>
          <View style={styles.button}>
            <Button
              title={styleState?.strikeThrough ? "S" : "S"}
              color={styleState?.bold ? "#000" : "#bebebeff"}
              onPress={() => ref.current?.toggleStrikeThrough()}
            />
          </View>
          <View style={styles.button}>
            <Button
              title={styleState?.orderedList ? "1" : "1"}
              color={styleState?.bold ? "#000" : "#bebebeff"}
              onPress={() => ref.current?.toggleOrderedList()}
            />
          </View>
          <View style={styles.button}>
            <Button
              title={styleState?.unorderedList ? "." : "."}
              color={styleState?.bold ? "#000" : "#bebebeff"}
              onPress={() => ref.current?.toggleUnorderedList()}
            />
          </View>
        </View>
      </View>
      {/* </View> */}
    </KeyboardAvoidingView>
  );
}
