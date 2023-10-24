import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const OpenHouseParty = () => {
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState('');
  const inputRef = useRef(null);

  const handleAddGuest = async () => {
    const trimmedGuestName = newGuest.trim();
    if (trimmedGuestName !== '') {
      try {
        const randomColor = Math.random() > 0.5 ? 'blue' : 'red';
        const newGuestItem = {
          id: Date.now(),
          name: trimmedGuestName,
          color: randomColor,
          isLeftVenue: false,
        };
        const updatedGuests = [...guests, newGuestItem];
        setGuests(updatedGuests);
        setNewGuest('');

        await AsyncStorage.setItem('guests', JSON.stringify(updatedGuests));
        inputRef.current.focus();
      } catch (error) {
        console.error('Error saving guest data:', error);
      }
    } else {
      console.log('Guest name cannot be empty');
    }
  };

  const handleToggleLeftVenue = (guestId) => {
    const updatedGuests = guests.map((guest) =>
      guest.id === guestId
        ? { ...guest, isLeftVenue: !guest.isLeftVenue }
        : guest
    );
    setGuests(updatedGuests);
    AsyncStorage.setItem('guests', JSON.stringify(updatedGuests));
  };

  const handleDeleteGuest = async (guestId) => {
    try {
      const updatedGuests = guests.filter((guest) => guest.id !== guestId);
      setGuests(updatedGuests);
      await AsyncStorage.setItem('guests', JSON.stringify(updatedGuests));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  useEffect(() => {
    const fetchRemoteGuests = async () => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users?_limit=5'
        );
        const data = await response.json();

        const remoteAttendees = data.map((attendee) => ({
          id: attendee.id,
          name: attendee.name,
          color: Math.random() > 0.5 ? 'blue' : 'red',
        }));

        // Store remote guests in a separate variable
        const updatedGuests = [...guests, ...remoteAttendees];

        // Update the state with the merged data
        setGuests(updatedGuests);

        // Store the merged data in AsyncStorage
        await AsyncStorage.setItem('guests', JSON.stringify(updatedGuests));
      } catch (error) {
        console.error('Error fetching remote attendees:', error);
      }
    };

    // Call the function to fetch remote attendees when component mounts
    fetchRemoteGuests();
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  return (
    <View style={styles.container}>
      <Text style={styles.text}>NĀRVARO SYNC STORE API</Text>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="skriv namn här"
        value={newGuest}
        onChangeText={(text) => setNewGuest(text)}
        onSubmitEditing={handleAddGuest}
      />
      <Button
        style={styles.button}
        title="REGISTERERA"
        onPress={handleAddGuest}
      />

      <FlatList
        data={guests}
        renderItem={({ item }) => (
          <View style={styles.guestItemContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteGuest(item.id)}>
              <Icon name="trash-o" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.guestItemTouchable}
              onPress={() => handleToggleLeftVenue(item.id)}>
              <Text
                style={{
                  ...styles.guestItem,
                  color: item.isLeftVenue ? 'gray' : item.color,
                  textDecorationLine: item.isLeftVenue
                    ? 'line-through'
                    : 'none',
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 86,
  },
  text: {
    margin: 24,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    color: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    height: 40,
    backgroundColor: 'blue',
    color: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 12,
  },
  guestItemContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginBotom: 4,
    padding: 8,
  },

  deleteButton: {
    backgroundColor: 'darkred',
    padding: 8,
    borderRadius: 5,
    marginRight: 8, // Add margin to separate the icon from the text
  },
  /*
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  */
  deleteButtonText: {
    color: 'white',
  },
  guestItemTouchable: {
    flex: 1,
  },
});

export default OpenHouseParty;

