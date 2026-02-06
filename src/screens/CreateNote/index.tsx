// import React, { useEffect, useRef, useState, useCallback } from "react";
// import {
//   TextInput,
//   View,
//   KeyboardAvoidingView,
//   ScrollView,
//   TouchableOpacity,
//   Platform,
//   Text,
//   Alert,
//   Image,
//   FlatList,
// } from "react-native";
// import styles from "./style";
// import {
//   actions,
//   RichEditor,
//   RichToolbar,
// } from "react-native-pell-rich-editor";
// import {
//   useAiSummaryMutation,
//   useDeleteMutation,
//   useGetNoteByIdQuery,
//   useSaveNoteMutation,
//   useUpdateMutation,
//   useUploadFileMutation,
// } from "@redux/api/noteApi";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "src/navigation/types";
// import { useNetInfo } from "@react-native-community/netinfo";
// import { createTable } from "src/db/createTable";
// import { v4 as uuidv4 } from "uuid";
// import "react-native-get-random-values";
// import { notesTable, SyncStatus } from "src/db/schema";
// import Toast from "react-native-toast-message";
// import { db } from "src/db/notes";
// import { useSelector } from "react-redux";
// import { RootState } from "@redux/store";
// import { and, eq } from "drizzle-orm";
// import {
//   AntDesign,
//   Entypo,
//   Ionicons,
//   MaterialCommunityIcons,
//   MaterialIcons,
// } from "@expo/vector-icons";
// import Reminder from "@components/atoms/Reminder";
// import { useFocusEffect } from "@react-navigation/native";
// import Summary from "@components/atoms/Summary";
// import { launchImageLibrary, Asset } from "react-native-image-picker";
// import useDebounce from "src/debounce/debounce";
// import { DocumentPickerResponse, pick } from "@react-native-documents/picker";
// import BackgroundColor from "@components/Molecules/BackgroundColor";
// type CreateNoteProps = NativeStackScreenProps<RootStackParamList, "CreateNote">;

// type FileType = {
//   uri: string;
//   name: string | null;
//   size: number | null;
//   type: string | null;
//   hasRequestedType: boolean;
//   isVirtual: boolean | null;
// };

// export default function CreateNote({
//   navigation,
//   route,
// }: Readonly<CreateNoteProps>) {
//   const userId = useSelector((state: RootState) => state.auth.token);
//   const isGuest = useSelector((state: RootState) => state.auth.isGuest);
//   const hasCommonPassword = useSelector((state : RootState)=> state.auth.isCommonPasswordSet)
//   const [noteBackground, setNoteBackground] = useState<string>("#f5f5f5");
//   const { isConnected } = useNetInfo();
//   const [textToolBarVisibility, setTextToolBarVisibility] = useState(false);
//   const [isNoteSaved, setIsNoteSaved] = useState(false);
//   function toggleTextToolBarVisibility() {
//     setTextToolBarVisibility(!textToolBarVisibility);
//   }
//   const [headerModalVisibility, setHeaderModalVisibility] = useState(false);
//   function toggleHeaderModalVisibility() {
//     setHeaderModalVisibility(!headerModalVisibility);
//   }
//   const [isColorPaletteVisible, setIsColorPaletteVisible] = useState(false);
//   function toggleColorPaletteVisibility() {
//     setIsColorPaletteVisible(!isColorPaletteVisible);
//   }
//   const [showReminder, setShowReminder] = useState(false);
//   function toggleReminderVisibility() {
//     setShowReminder(!showReminder);
//   }
//   const [showSummary, setShowSummary] = useState(false);
//   function toggleShowSummary() {
//     setShowSummary(!showSummary);
//   }

//   const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
//   function toggleShowAttachmentOptions() {
//     setShowAttachmentOptions(!showAttachmentOptions);
//   }
//   // const [images, setImages] = useState<Asset[]>([]);
//   const [files, setFiles] = useState<DocumentPickerResponse[]>([]);
//   const [uploadApi] = useUploadFileMutation();
//   const [saveApi] = useSaveNoteMutation()
//   const [editApi] = useUpdateMutation();
//   const [deleteApi] = useDeleteMutation();

//   // const noteId = route?.params?.id;
//   const [noteId, setNoteId] = useState<string>("");
//   const { data: NotesData, refetch } = useGetNoteByIdQuery(
//     { id: String(noteId) },
//     { skip: !noteId, refetchOnFocus: true },
//   );
//   const [AISummary] = useAiSummaryMutation();
//   const [aiSummary, setAiSummary] = useState("");
//   async function generateSummary() {
//     try {
//       const response = await AISummary({ id: String(noteId) });
//       setAiSummary(response.data.summary);
//     } catch (error) {
//       console.log("Error generating AI summary: ", error);
//     }
//   }

//   useEffect(() => {
//     if (route?.params?.id) {
//       setNoteId(route?.params?.id);
//     } else {
//       setNoteId(uuidv4());
//     }
//   }, [route]);

//   useFocusEffect(
//     useCallback(() => {
//       if (noteId) {
//         refetch();
//       }
//     }, [noteId]),
//   );

//   const isEditMode = Boolean(route?.params?.id);
//   const [notes, setNotes] = useState({
//     id: "",
//     title: "",
//     content: "",
//     isPasswordProtected: false,
//     isReminderSet: null,
//     backgroundColor: "#ffffff",
//     FilePaths: [],
//   });

  

//   useEffect(() => {
//     if (!NotesData?.data) return;
//     setNotes({
//       id: NotesData.data.id ?? "",
//       title: NotesData.data.title ?? "",
//       content: NotesData.data.content ?? "",
//       isPasswordProtected: NotesData.data.isPasswordProtected ?? false,
//       isReminderSet: NotesData.data.isReminderSet ?? null,
//       backgroundColor: NotesData.data.backgroundColor ?? "#f5f5f5",
//       FilePaths: NotesData.data.FilePaths ?? [],
//     });

//     richText.current?.setContentHTML(NotesData.data.content ?? "");
//   }, [NotesData]);
//   useEffect(() => {
//     if (NotesData?.data?.backgroundColor) {
//       setNoteBackground(NotesData.data.backgroundColor);
//     }
//   }, [NotesData]);
//   useEffect(() => {
//     if (!route.params?.unlockUntil) return;

//     const remaining = route.params.unlockUntil - Date.now();
//     if (remaining <= 0) return lock();

//     const timer = setTimeout(lock, remaining);
//     return () => clearTimeout(timer);
//   }, [route.params?.unlockUntil]);

//   function lock() {
//     Toast.show({ text1: "Note locked" });
//     navigation.navigate("Dashboard");
//   }

//   const [isLocked, setIsLocked] = useState(false);
//   const [isReminder, setIsReminder] = useState(false);

//   useEffect(() => {
//     if (NotesData?.data?.isReminderSet) {
//       setIsReminder(true);
//     }
//   }, [NotesData?.data?.isReminderSet]);

//   useEffect(() => {
//     if (NotesData?.data?.isPasswordProtected !== undefined) {
//       setIsLocked(!!NotesData.data.isPasswordProtected);
//     }
//   }, [NotesData?.data?.isPasswordProtected]);

//   function toggleLock() {
//     setIsLocked(!isLocked);
//   }



//   async function pickFile() {
//     try {
//       const result = await pick({
//         allowMultiSelection: true,
//         allowVirtualFiles: false,
//       });
//       setFiles(result);
//     } catch (error) {
//       console.log("Error uploading file", error);
//     }
//   }



// async function uploadFiles(files: DocumentPickerResponse[]) {
//   const uploadedPaths: string[] = [];

//   for (const f of files) {
//     try {
//       if (!f?.uri) continue;

//       const formData = new FormData();

//       const uri = (() => {
//         const raw = f.uri ?? "";
//         if (Platform.OS === "android") {
//           if (raw.startsWith("file://") || raw.startsWith("content://")) {
//             return raw;
//           }
//           if (raw.startsWith("/")) {
//             return `file://${raw}`;
//           }
//           return raw;
//         }
//         return raw;
//       })();

//       formData.append("file", {
//         uri,
//         name: f.name ?? "file",
//         type: f.type ?? "application/octet-stream",
//       } as any);

//       try {
//         const res = await uploadApi(formData).unwrap();
//         console.log(res,"kjglh");
//         if (res?.data?.path) uploadedPaths.push(res.data.path);
//       } catch (uploadErr) {
//         console.log("Upload error for file:", f.name ?? f.uri, uploadErr);
      
//       }
//     } catch (err) {
//       console.log("Unexpected error processing file:", f, err);
//     }
//   }

//   return uploadedPaths;
// }

// async function handleSave(navigate = true) {
//   try {
//     const localId = await saveToLocalDB(isConnected ? "synced" : "pending");
//     if (!isConnected) return;

//     let uploadedFilePaths: string[] = [];

//     if (files.length > 0) {
//       try {
//         uploadedFilePaths = await uploadFiles(files);
//       } catch (err) {
//         console.log("One or more file uploads failed:", err);
//       }
//     }

    
//     const body = {
//       Title: notes.title,
//       Content: notes.content,
//       IsPasswordProtected: isLocked,
//       BackgroundColor: noteBackground,
//       IsReminderSet: isReminder,
//       FilePaths: uploadedFilePaths,
//     };
//     if (isEditMode) {
//       await editApi({ id: noteId, body }).unwrap();
//     } else {
//       await saveApi(body).unwrap();
//     }

//     setIsNoteSaved(true);

//     if (navigate) navigation.goBack();
//   } catch (error) {
//     console.log("Save error:", error);
//   }
// }



//   async function handleDelete() {
//     try {
//       if (!noteId) {
//         Toast.show({
//           text1: "Empty note can’t be deleted",
//         });
//         return;
//       }
//       if (!userId) throw new Error("userID is not correct");
//       await db
//         .delete(notesTable)
//         .where(and(eq(notesTable.id, noteId), eq(notesTable.userId, userId)));

//       if (isConnected) {
//         await deleteApi({ id: noteId }).unwrap();
//       }
//       Toast.show({
//         text1: "Deleted",
//       });
//       navigation.goBack();
//     } catch (error) {
//       console.log("Delete error:", error);
//     }
//   }

//   async function saveToLocalDB(status: SyncStatus) {
//     await createTable();
//     if (!userId) {
//       throw new Error("userId is required to create a note");
//     }

//     const id = noteId ?? uuidv4();
//     const filePaths = files.map((f) => f.uri);

//     await db
//       .insert(notesTable)
//       .values({
//         id,
//         userId,
//         title: notes.title,
//         content: notes.content,
//         updatedAt: new Date().toISOString(),
//         isPasswordProtected: isLocked ? 1 : 0,
//         isReminderSet: isReminder ? 1 : 0,
//         syncStatus: status,
//         FilePaths: JSON.stringify(filePaths),
//       })
//       .onConflictDoUpdate({
//         target: notesTable.id,
//         set: {
//           title: notes.title,
//           content: notes.content,
//           updatedAt: new Date().toISOString(),
//           isPasswordProtected: isLocked ? 1 : 0,
//           isReminderSet: isReminder ? 1 : 0,
//           syncStatus: status,
//           FilePaths: JSON.stringify(filePaths),
//         },
//       });

//     return id;
//   }

//   function handleLock() {
//     if (isNoteSaved) {
//       navigation.goBack();
//       return;
//     }
// if(hasCommonPassword){
//   return;
// }
// else{
//     Alert.alert(
//       "Save Note first",
//       "You will lose your note data without saving",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Set Password",
//           onPress: () =>
//             navigation.navigate("NotesPassword", { id: String(noteId) }),
//         },
//       ],
//       { cancelable: true },
//     );
//   }
// }


//   useEffect(() => {
//     navigation.setOptions({
//       headerStyle: {
//         backgroundColor: noteBackground,
//       },
//       headerTransparent: false,
//       headerShadowVisible: false,
//       headerRight: () => (
//         <View style={styles.header}>
//           <TouchableOpacity onPress={handleSave}>
//             <Entypo
//               name="check"
//               size={30}
//               color="#5757f8"
//               style={styles.headerButton}
//             />
//           </TouchableOpacity>
//         </View>
//       ),
//     });
//   }, [navigation, noteBackground, handleSave]);
//   const debouncedNotes = useDebounce(
//     {
//       title: notes.title,
//       content: notes.content,
//       isPasswordProtected: isLocked,
//       backgroundColor: noteBackground,
//       isReminderSet: isReminder,
//       FilePaths: files,
//     },
//     4000,
//   );

//   useEffect(() => {
//     if (!debouncedNotes.title || !debouncedNotes.content) return;
//     handleSave(false);
//     if(files.length>0) return;
//   }, [debouncedNotes.title, debouncedNotes.content]);

//   const richText = useRef<RichEditor | null>(null);
//   return (
//     <KeyboardAvoidingView
//       style={[styles.all]}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <View style={[styles.container, { backgroundColor: noteBackground }]}>
//         <TextInput
//           placeholder="Title"
//           placeholderTextColor="#5c5c5c"
//           style={styles.title}
//           value={notes.title}
//           onChangeText={(value) =>
//             setNotes((prev) => ({ ...prev, title: value }))
//           }
//         />
//         <ScrollView
//           bounces={false}
//           contentContainerStyle={{
//             flexGrow: 1,
//             backgroundColor: noteBackground,
//           }}
//           style={{ backgroundColor: noteBackground }}
//         >
//           <View
//             style={[
//               styles.editorContainer,
//               { backgroundColor: noteBackground },
//             ]}
//           >
//             <RichEditor
//               ref={richText}
//               initialContentHTML={notes.content}
//               onChange={(val) =>
//                 setNotes((prev) => ({ ...prev, content: val }))
//               }
//               editorStyle={{
//                 backgroundColor: noteBackground,
//                 color: "#000",
//               }}
//               initialHeight={600}
//               placeholder="Type Here..."
//             />
//           </View>
//         </ScrollView>
//         {/* <View style={{ marginTop: 10 }}>
//           {images?.length > 0 && (
//             <FlatList
//               data={images}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => (
//                 <Image
//                   source={{ uri: item.uri }}
//                   style={{
//                     width: 80,
//                     height: 80,
//                   }}
//                 />
//               )}
//             />
//           )}
//         </View> */}
//         <FlatList
//           data={files}
//           keyExtractor={(item) => item.uri}
//           renderItem={({ item }) => (
//             <View
//               style={{ padding: 8, borderBottomWidth: 1, borderColor: "#ddd" }}
//             >
//               <Text>{item.name ?? "Unnamed file"}</Text>
//               <Text style={{ fontSize: 12, color: "#888" }}>
//                 {item.size ? (item.size / 1024).toFixed(1) : "Unknown"} KB |{" "}
//                 {item.type ?? "Unknown"}
//               </Text>
//             </View>
//           )}
//         />
//         {/* {files.map((file, index) => (
//           <View key={index} style={{ marginVertical: 6 }}>
//             {file.type?.startsWith("image/") && (
//               <Image
//                 source={{ uri: file.uri }}
//                 style={{ width: 60, height: 60, borderRadius: 8 }}
//               />
//             )}
//             <Text numberOfLines={1}>{file.name}</Text>
//           </View>
//         ))} */}

//         {textToolBarVisibility && (
//           <View style={styles.modal}>
//             <RichToolbar
//               editor={richText}
//               actions={[
//                 actions.setBold,
//                 actions.setItalic,
//                 actions.setUnderline,
//                 actions.checkboxList,
//                 actions.insertBulletsList,
//                 actions.insertOrderedList,
//                 actions.setStrikethrough,
//               ]}
//               iconSize={28}
//               selectIconTint="#000"
//               iconTint="#5757f8"
//               style={styles.toolbar}
//             />
//             <TouchableOpacity
//               onPress={toggleTextToolBarVisibility}
//               style={{
//                 alignSelf: "center",
//                 backgroundColor: "#E0E7FF",
//                 borderRadius: 25,
//                 padding: 2,
//               }}
//             >
//               <AntDesign name="close" size={24} style={[styles.optionIcon]} />
//             </TouchableOpacity>
//           </View>
//         )}

//         {headerModalVisibility && (
//           <View style={{ position: "absolute", bottom: 80, right: 20 }}>
//             <View style={styles.headerMenu}>
//               {notes.isPasswordProtected ? (
//                 <TouchableOpacity
//                   style={styles.touchables}
//                   onPress={toggleLock}
//                   disabled={isGuest}
//                 >
//                   <AntDesign name="unlock" color="#5757f8" size={24} />
//                   <Text style={styles.touchableText}>Unlock</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity
//                   style={styles.touchables}
//                   onPress={() => {
//                     handleLock();
//                     toggleLock();
//                   }}
//                   disabled={isGuest}
//                 >
//                   <AntDesign name="lock" color="#5757f8" size={24} />
//                   <Text style={styles.touchableText}>Lock</Text>
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity
//                 style={styles.touchables}
//                 onPress={toggleReminderVisibility}
//               >
//                 <Ionicons
//                   color="#5757f8"
//                   size={24}
//                   name="notifications-outline"
//                 />
//                 <Text style={styles.touchableText}>Reminder</Text>
//               </TouchableOpacity>

//               {isEditMode && (
//                 <TouchableOpacity
//                   style={styles.touchables}
//                   onPress={handleDelete}
//                 >
//                   <MaterialIcons
//                     name="delete-outline"
//                     size={24}
//                     color="#5757f8"
//                   />
//                   <Text style={styles.touchableText}>Delete</Text>
//                 </TouchableOpacity>
//               )}
//               <View />
//             </View>
//           </View>
//         )}

//         {isColorPaletteVisible && (
//           <BackgroundColor
//             selectedColor={noteBackground}
//             onSelectColor={(color) => {
//               setNoteBackground(color);
//               setNotes((prev) => ({ ...prev, backgroundColor: color }));
//             }}
//           />
//         )}
//         <View style={styles.line} />

//         {showReminder ? (
//           <Reminder
//             id={noteId}
//             onClose={() => setShowReminder(false)}
//             onReminderSet={async (id) => {
//               setIsReminder(true);
//               if (isConnected && id) {
//                 await editApi({
//                   id,
//                   title: notes.title,
//                   content: notes.content,
//                   isPasswordProtected: isLocked,
//                   backgroundColor: noteBackground,
//                   isReminderSet: true,
//                 }).unwrap();
//               }
//             }}
//           />
//         ) : null}

//         {showSummary ? (
//           <Summary
//             id={notes.id}
//             onClose={() => setShowSummary(false)}
//             data={aiSummary}
//           />
//         ) : null}

//         {/* Options bottom  */}
//         {!textToolBarVisibility ? (
//           <View style={styles.options}>
//             <TouchableOpacity
//               onPress={toggleTextToolBarVisibility}
//               style={styles.optionButton}
//             >
//               <MaterialCommunityIcons
//                 name="format-text"
//                 size={24}
//                 style={styles.optionIcon}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.optionButton} onPress={pickFile}>
//               <Entypo name="attachment" size={24} style={styles.optionIcon} />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.optionButton}
//               onPress={() => {
//                 toggleShowSummary();
//                 generateSummary();
//               }}
//             >
//               <Ionicons
//                 name="sparkles-outline"
//                 size={24}
//                 style={styles.optionIcon}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.optionButton}
//               onPress={toggleColorPaletteVisibility}
//             >
//               <Ionicons
//                 name="color-palette-outline"
//                 size={24}
//                 style={styles.optionIcon}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={toggleHeaderModalVisibility}
//               style={styles.optionButton}
//             >
//               {headerModalVisibility ? (
//                 <AntDesign name="close" size={24} style={styles.optionIcon} />
//               ) : (
//                 <MaterialIcons
//                   name="more-vert"
//                   size={24}
//                   style={styles.optionIcon}
//                 />
//               )}
//             </TouchableOpacity>
//           </View>
//         ) : null}
//       </View>
//     </KeyboardAvoidingView>
//   );
// }
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
  useSaveNoteMutation,
  useUpdateMutation,
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
import { useUploadFileMutation } from "@redux/api/noteApi";
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
import { launchImageLibrary, Asset } from "react-native-image-picker";
import useDebounce from "src/debounce/debounce";
import FileViewer from "react-native-file-viewer";
import { Linking } from "react-native";

type CreateNoteProps = NativeStackScreenProps<RootStackParamList, "CreateNote">;

export default function CreateNote({
  navigation,
  route,
}: Readonly<CreateNoteProps>) {
  const userId = useSelector((state: RootState) => state.auth.token);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
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
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);
async function pickFile() {
    try {
      const result = await pick({
        allowMultiSelection: true,
        allowVirtualFiles: true,
      });
      setFiles(prev=>[...prev,...result]);
    } catch (error) {
      console.log("Error uploading file", error);
    }
  }

   async function uploadFilesToBackend(files: DocumentPickerResponse[]){

    const uploadedPaths : string[] = [];
    for (const file of files) {
    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      type: file.type ?? "application/octet-stream",
      name: file.name ?? "file",
    } as any);

    const response = await uploadApi(formData).unwrap();

    const data = await response.json();
    uploadedPaths.push(data.path);
  }
  return uploadedPaths;
   }
 
async function handleSave(navigate=true) {
  try {
    let filePaths: string[] = [];

    if (isConnected && files.length > 0) {
      filePaths = await uploadFilesToBackend(files);
    }

    const localId = await saveToLocalDB(
      isConnected ? "synced" : "pending"
    );

    if (isConnected) {
      const payload = {
        id: localId,
        title: notes.title,
        content: notes.content,
        isPasswordProtected: isLocked,
        backgroundColor: noteBackground,
        isReminderSet: isReminder,
        filePaths, 
      };

      isEditMode
        ? await editApi(payload).unwrap()
        : await saveApi(payload).unwrap();
    }

    navigation.goBack();
    setIsNoteSaved(true);
  } catch (error) {
    console.log("Save error:", error);
  }
}

  

  async function handleDelete(navigate=true) {
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
     if(navigate) navigation.goBack();
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

  function handleLock() {
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
const [previewImage, setPreviewImage] = useState<string | null>(null);

  async function openFile(file: DocumentPickerResponse) {
  try {
    if (file.type?.startsWith("image")) {
      setPreviewImage(file.uri); // image preview
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
                  disabled={isGuest}
                >
                  <AntDesign name="unlock" color="#5757f8" size={24} />
                  <Text style={styles.touchableText}>Unlock</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.touchables}
                  onPress={() => {
                    handleLock();
                    toggleLock();
                  }}
                  disabled={isGuest}
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
