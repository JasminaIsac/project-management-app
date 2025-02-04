import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SelectDeadlineInput = ({deadline, onChange}) => {

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(deadline ? new Date(deadline) : new Date());

  const formattedDeadline = selectedDate.toISOString().split('T')[0]; // Formatăm data

// console.log(deadline,new Date(deadline).toISOString() );

  const onDateChange = (event, date) => {
    setShowDatePicker(false); // Ascundem picker-ul
    if (date) {
      setSelectedDate(date); // Setăm data selectată
      onChange(date.toISOString()); // Apelăm funcția onChange cu data formatată
    }
  };
  
  return (
    <View>
      <Text style={styles.label}>Deadline</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={formattedDeadline}
          placeholder="Select deadline"
          editable={false} // Câmpul nu este editabil
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.iconContainer}>
          <Icon name="calendar-today" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange} // Apelăm funcția la schimbare
          minimumDate={new Date()} // Nu permite selectarea unei date anterioare
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});


export default SelectDeadlineInput;


