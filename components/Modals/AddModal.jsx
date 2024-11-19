import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';

const AddWaterModal = ({ visible, onClose }) => {
  const [selectedIcon, setSelectedIcon] = useState(null);

  const icons = ['💧', '🥤', '🍶', '☕', '🍵']; // Example icons

  const handleSave = () => {
    // Add save functionality here
    console.log('Save pressed!');
    onClose();
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
            <TextInput style={styles.textInput} placeholder="Enter name" />
          </View>

          {/* Amount Input */}
          <View style={[styles.formRow, styles.spaceBetween]}>
            <Text style={styles.label}>Amount (ml):</Text>
            <TouchableOpacity style={styles.infoButton} onPress={() => alert('1L = 1000ml')}>
              <Text style={styles.infoButtonText}>ℹ️</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={styles.textInput} placeholder="Enter amount in ml" keyboardType="numeric" />

          {/* Icon Selection */}
          <Text style={[styles.label, styles.iconLabel]}>Choose Icon:</Text>
          <FlatList
            horizontal
            data={icons}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.iconCircle,
                  selectedIcon === item && styles.selectedIconCircle,
                ]}
                onPress={() => setSelectedIcon(item)}
              >
                <Text style={styles.icon}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.iconContainer}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
    fontWeight: '500',
  },
  textInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  infoButton: {
    marginLeft: 10,
  },
  infoButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconLabel: {
    marginTop: 20,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
  },
  selectedIconCircle: {
    borderColor: '#007bff',
    backgroundColor: '#e6f0ff',
  },
  icon: {
    fontSize: 18,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddWaterModal;
