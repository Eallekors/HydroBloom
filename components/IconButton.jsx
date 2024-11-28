import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';

export default function IconButton({
  title,
  onPress,
  icon,
  style,
  textStyle,
  dropdownItems,
  onOptionSelect,
  defaultSelected // Added defaultSelected prop
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ title: defaultSelected, icon }); // Set initial state with defaultSelected

  const iconMapping = {
    'water-bottle.png': require('../assets/icons/water-bottle.png'),
    'juice-bottle.png': require('../assets/icons/juice-bottle.png'),
    'coffe-glass.png': require('../assets/icons/water-glass.png'),
    'ruler': require('../assets/icons/ruler.png'),
    'clock': require('../assets/icons/time.png'),
    'notif': require('../assets/icons/notification.png'),
    'data': require('../assets/icons/data.png'),
    // Add more icons as your data changes or expands
  };
  // Function to handle dropdown toggle, but only if dropdownItems exist
  const toggleDropdown = () => {
    if (dropdownItems && dropdownItems.length > 0) {
      setIsOpen(!isOpen);  // Only toggle dropdown if there are items
    } else {
      onPress && onPress();  // If no dropdownItems, just trigger onPress
    }
  };

  const handleOptionSelect = (item) => {
    setSelectedOption(item);
    setIsOpen(false);

    // Call the onOptionSelect function passed from the parent and pass the selected option
    onOptionSelect(title, item); // Pass the button title and selected item to the parent
  };

  // Optionally, you can use an effect to update the selectedOption when dropdownItems or defaultSelected change
  useEffect(() => {
    if (dropdownItems && dropdownItems.length > 0) {
      const defaultItem = dropdownItems.find(item => item.title === defaultSelected);
      if (defaultItem) {
        setSelectedOption(defaultItem);
      }
    }
  }, [dropdownItems, defaultSelected]);
 

  // Dynamically require the image based on the icon name passed
  const getIconSource = (iconName) => {
    return iconMapping[iconName] || require('../assets/icons/x.jpg'); // Default icon in case of missing mapping
  };

  return (
    <View>
      {/* Main Button */}
      <TouchableOpacity style={[styles.button, style]} onPress={toggleDropdown}>
        <View style={styles.iconContainer}>
          <Image source={getIconSource(icon)} style={styles.icon} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          <Text style={[styles.buttonText, textStyle]}>{selectedOption.title}</Text>
        </View>
      </TouchableOpacity>

      {/* Dropdown Buttons */}
      {isOpen && dropdownItems && dropdownItems.length > 0 && (
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
              <View
                style={[
                  styles.dropTextContainer,
                  selectedOption.title === item.title && { backgroundColor: '#EBEBEB' }, // Change container background color
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    textStyle,
                    selectedOption.title === item.title && { color: 'black' }, // Change text color for selected option
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
    width: '95%',  // Changed width to 90%
    overflow: 'hidden',
    elevation: 5,
    alignSelf: 'center',
    marginVertical: 5,
    
  },
  dropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: 5,
    height: 58,
    width: '90%',
    overflow: 'hidden',
    elevation: 5,
    marginRight: 10,
    
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
    marginTop: 10,
    marginBottom: 10,
    
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'space-between', // Distribute items with space between them
    gap: 10,  // Optional: Can also add a gap for consistent spacing if 'justifyContent' isn't enough
  },
  dropdownButton: {
    marginBottom: 5,
  },
  
});