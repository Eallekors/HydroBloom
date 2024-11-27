import React, { useState, useLayoutEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import SelectableModal from '../../components/Modals/Modal';
import AddWaterModal from '../../components/Modals/AddModal';
import Container from '../../components/Container'; // Import the Container component
import buttonsData from '../../data/contrainers.json'; // Import JSON data

const { height, width } = Dimensions.get('window'); // Get screen dimensions here

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [buttons, setButtons] = useState(buttonsData); // Initialize state with imported data
  const [selectedButton, setSelectedButton] = useState(null);

  const [containerHeight, setContainerHeight] = useState(0);

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleAddModal = () => setAddModalVisible(!addModalVisible);

  const deleteButton = () => {
    if (selectedButton !== null) {
      setButtons((prev) => prev.filter((_, index) => index !== selectedButton));
      setSelectedButton(null);
      toggleModal();
    }
  };

  const addButton = (newButton) => {
    setButtons((prev) => [...prev, newButton]);
    toggleAddModal();
  };

  return (
    <ImageBackground
      source={require('../../assets/icons/home.png')}
      style={styles.safeArea}
    >
      {/* Container with total height */}
      <Container style={styles.container}>
        <Text style={styles.containerText}>
          Total Height: <Text style={styles.containerStats}>{containerHeight}px</Text>
        </Text>
        <Text style={styles.containerText}>
          Day Streak: <Text style={styles.containerStats}>{containerHeight}px</Text>
        </Text>
      </Container>

      {/* Main content */}
      
      {/* Circle Button */}
      <TouchableOpacity style={styles.circleButton} onPress={toggleModal}>
        <Image style={styles.icon} source={require('../../assets/icons/water-glass.png')} />
      </TouchableOpacity>

      {/* Modals */}
      <SelectableModal
        visible={modalVisible}
        data={buttons}
        onClose={toggleModal}
        onSelect={(index) => setSelectedButton(index)}
        onAdd={toggleAddModal}
        onDelete={deleteButton}
      />
      <AddWaterModal
        visible={addModalVisible}
        onClose={toggleAddModal}
        onSave={addButton}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    top: '0%', // Positioned 10% from the top of the screen
    left: '50%', // Align horizontally to the center
    marginLeft: -(width * 0.6) / 2, // Offset the container by half its width to center it
    width: width * 0.6, // Make container 80% of the screen width
    height: height * 0.15, // Set the container height to 20% of the screen height
    justifyContent: 'center', // Center the content vertically within the container
  },
  containerText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
  },
  containerStats: {
    backgroundColor: '#3498db', // Background color for the stats
    color: '#fff', // Text color inside the stats
    width: 10,
    height: 10,
    paddingVertical: 5, // Padding to give the background some height
    paddingHorizontal: 15, // Padding to make it rounded
    borderRadius: 5, // Rounded corners
    fontWeight: 'bold', // Bold the number
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
  circleButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
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
  icon: {
    width: 32,
    height: 32,
  },
});

export default Home;
