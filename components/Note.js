import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Note = ({ note, onDelete, scheduleReminder }) => {
  return (
    <View style={styles.noteContainer}>
      <Text style={styles.noteTitle}>{note.title}</Text>
      <Text style={styles.noteDescription}>{note.description}</Text>

      {note.reminderDate && (
        <Text style={styles.reminderText}>Reminder: {new Date(note.reminderDate).toLocaleString()}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={onDelete}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>

      {note.reminderDate && (
        <TouchableOpacity style={styles.button} onPress={() => scheduleReminder(note.reminderDate)}>
          <Text style={styles.buttonText}>Set Reminder</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteDescription: {
    fontSize: 16,
    marginVertical: 5,
  },
  reminderText: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    backgroundColor: '#FF6347',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Note;
