import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Image } from 'react-native';

export default function IconButton({ title, onPress, icon, style, textStyle, dropdownItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ title, icon }); // State to hold selected option

  // Function to toggle dropdown open/close
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Function to handle option selection
  const handleOptionSelect = (item) => {
    setSelectedOption(item);  // Update the selected option
    setIsOpen(false);         // Close the dropdown
  };

  return (
    <View>
      {/* Main Button */}
      <TouchableOpacity style={[styles.button, style]} onPress={toggleDropdown}>
        <View style={styles.iconContainer}>
          <Image source={icon} style={styles.icon} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          <Text style={[styles.buttonText, textStyle]}>{selectedOption.title}</Text>
        </View>
      </TouchableOpacity>

      {/* Dropdown Buttons */}
      {isOpen && (
        <View style={styles.dropdownContainer}>
          {dropdownItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dropButton,
                selectedOption.title === item.title && styles.selectedOption,  // Apply selectedOption style if selected
              ]}
              onPress={() => handleOptionSelect(item)} // Select an option
            >
              <View style={styles.dropTextContainer}>
                <Text
                  style={[
                    styles.buttonText,
                    textStyle,
                    selectedOption.title === item.title && { color: '#fff' }, // Change text color for selected option
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    height: 58,
    width: '100%',
    overflow: 'hidden',
    elevation: 11,
  },
  dropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    height: 58,
    width: '100%',
    overflow: 'hidden',
    elevation: 11,
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#E5E5EF',
    height: 58,
    width: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '75%',
    height: '75%',
  },
  textContainer: {
    backgroundColor: '#EEEDFF',
    flex: 1,
    borderRadius: 5,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -27,
    paddingLeft: 30,
    borderColor: '#E5E5EF',
    borderWidth: 1,
    zIndex: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dropTextContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    borderRadius: 5,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -27,
    paddingLeft: 30,
    borderColor: '#E5E5EF',
    borderWidth: 1,
    zIndex: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    marginTop: 10,
  },
  dropdownButton: {
    marginBottom: 5,
  },
  // Style for the selected option
  selectedOption: {
    backgroundColor: '#007BFF',  // Background color for selected option
  },
});
