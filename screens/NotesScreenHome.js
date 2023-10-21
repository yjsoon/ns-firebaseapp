import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

export default function NotesScreenHome() {
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);

  // Load notes when this screen shows up for the first time
  useEffect(() => {
    const q = query(collection(db, "notes"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts = querySnapshot.docs.map((doc, index) => {
        return { ...doc.data(), id: index };
      });
      setNotes(posts);
    });

    // this is what runs when we unload this page
    return () => {
      unsubscribe();
    };
  }, []);

  function renderItem({ item }) {
    return (
      <View style={styles.noteCard}>
        <Text style={styles.noteCardTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => {}}>
          <FontAwesome name={"remove"} size={24} color={"black"} />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>notes</Text>

      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(post) => post.id.toString()}
      />

      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Add")}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  noteCardTitle: {
    fontSize: 13,
    fontWeight: "500"
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
    padding: 25
  },
  title: {
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 20
  },
  button: {
    backgroundColor: "black",
    borderRadius: 15,
    width: "100%"
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 17,
    padding: 20,
    color: "white"
  }
});
