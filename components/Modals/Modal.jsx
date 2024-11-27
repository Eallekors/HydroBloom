import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import IconButton from '../IconButton';
import Container from '../Container';
import Header from '../Header';

const SelectableModal = ({ visible, onClose, data, onSelect, onAdd, onDelete }) => {
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Container style={styles.modalContent}>
          <Header
            title="Select Item to Drink"
            showBack={true}
            onBackPress={onClose}
          />
          {/* List of Buttons */}
          
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <IconButton
                title={item.title} // Dynamically set the title
                defaultSelected={item.defaultSelected} // Dynamically set the default selection
                onPress={() => {
                  onSelect(index);
                  onClose();
                }}
                icon={item.icon} // Dynamically set the icon
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No items to display</Text>
            }
          />
          {/* + and - Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.circleButton} onPress={onAdd}>
              <Text style={styles.circleButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton} onPress={onDelete}>
              <Text style={styles.circleButtonText}>-</Text>
            </TouchableOpacity>
          </View>
        </Container>
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
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  circleButtonText: {
    fontSize: 24,
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default SelectableModal;
