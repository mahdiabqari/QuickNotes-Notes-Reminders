import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, AsyncStorage, StyleSheet } from 'react-native';
import PushNotification from 'react-native-push-notification';
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Import DatePicker modal
import Note from './components/Note';

const App = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderDate, setReminderDate] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // State to show the DateTimePicker

  // Load notes from AsyncStorage on app start
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.log('Error loading notes', error);
    }
  };

  // Save new note
  const handleSaveNote = async () => {
    const newNote = { title, description, reminderDate, id: Date.now().toString() };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    setTitle('');
    setDescription('');
    setReminderDate(null);
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  // Set reminder notification
  const scheduleReminder = (reminderDate) => {
    PushNotification.localNotificationSchedule({
      message: 'Your reminder has arrived!',
      date: new Date(reminderDate),
    });
  };

  // Show DateTimePicker
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  // Handle date selection from DateTimePicker
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setReminderDate(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>QuickNotes</Text>

      {/* Add Note Form */}
      <TextInput
        style={styles.input}
        placeholder="Note Title"
        placeholderTextColor="#fff"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Note Description"
        placeholderTextColor="#fff"
        value={description}
        onChangeText={setDescription}
      />

      {/* Set Reminder Date */}
      <TouchableOpacity style={styles.button} onPress={showDatePicker}>
        <Text style={styles.buttonText}>Set Reminder Time</Text>
      </TouchableOpacity>

      {/* Display selected reminder time */}
      {reminderDate && (
        <Text style={styles.reminderText}>
          Reminder set for: {reminderDate.toLocaleString()}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSaveNote}>
        <Text style={styles.buttonText}>Save Note</Text>
      </TouchableOpacity>

      {/* Notes List */}
      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <Note
            note={item}
            onDelete={() => handleDeleteNote(item.id)}
            scheduleReminder={scheduleReminder}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      {/* DateTimePicker modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2D2D2D', // Dark background to match the modern look
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF4C4C', // Red color for the header
    marginVertical: 30,
  },
  input: {
    height: 50,
    borderColor: '#FF4C4C', // Red border color for inputs
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#fff', // White text for inputs
    backgroundColor: '#333', // Dark background for inputs
  },
  button: {
    backgroundColor: '#1E90FF', // Blue background for buttons
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff', // White text for buttons
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderText: {
    fontSize: 16,
    color: '#FF4C4C', // Red color for reminder text
    marginVertical: 10,
    fontStyle: 'italic',
  },
});

export default App;
