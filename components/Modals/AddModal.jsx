import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';

const AddWaterModal = ({ visible, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(''); // This will store the numeric input
  const [selectedIcon, setSelectedIcon] = useState(null);

  // Mapping of icon names to actual image files
  const iconMapping = {
    'water-bottle.png': require('../../assets/icons/water-bottle.png'),
    'juice-bottle.png': require('../../assets/icons/juice-bottle.png'),
    'coffe-glass.png': require('../../assets/icons/water-glass.png'),
    'glass-glass.png': require('../../assets/icons/water-glass.png'),
    
    // Add more icons as your data changes or expands
  };

  const icons = Object.keys(iconMapping); // Get the keys (icon names) from the mapping

  const handleSave = () => {
    if (!name || !amount || !selectedIcon) {
      alert('Please fill in all fields');
      return;
    }

    // Save the amount as a number for calculations (without "ml")
    const newButton = {
      title: name,
      defaultSelected: parseInt(amount)+"ml", // Store as a number
      icon: selectedIcon, // Store the selected icon's name
    };

    // Call onSave prop to add the new button to the parent component
    onSave(newButton);

    // Close the modal
    onClose();
  };

  const handleAmountChange = (text) => {
    // Remove non-numeric characters, and set the amount (as number) for calculations
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Add Water Intake</Text>
          </View>

          {/* Name Input */}
          <View style={styles.formRow}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Amount Input */}
          <View style={[styles.formRow, styles.spaceBetween]}>
            <Text style={styles.label}>Amount (ml):</Text>
            <TouchableOpacity style={styles.infoButton} onPress={() => alert('1L = 1000ml')}>
              <Text style={styles.infoButtonText}>ℹ️</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Enter amount in ml"
            keyboardType="numeric"
            value={amount} // Display the numeric value with "ml"
            onChangeText={handleAmountChange} // Handle input changes
          />

          {/* Icon Selection */}
          <Text style={[styles.label, styles.iconLabel]}>Choose Icon:</Text>
          <FlatList
            horizontal
            data={icons} // Use the icon keys
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.iconCircle,
                  selectedIcon === item && styles.selectedIconCircle,
                ]}
                onPress={() => setSelectedIcon(item)}
              >
                <Image source={iconMapping[item]} style={styles.iconImage} />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.iconList}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconLabel: {
    marginTop: 10,
  },
  iconList: {
    marginBottom: 15,
    justifyContent: 'center', // Centers icons horizontally
    alignItems: 'center', // Centers icons vertically
    flexDirection: 'row', // Keeps icons in a row
  },
  iconCircle: {
    marginHorizontal: 10,
    padding: 20, // Increased padding to make the clickable area larger
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIconCircle: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  icon: {
    fontSize: 60, // Increased font size for larger icons
  },
  saveButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default AddWaterModal;
