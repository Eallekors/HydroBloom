import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import SelectableModal from '../../components/Modals/Modal';
import AddWaterModal from '../../components/Modals/AddModal';
import Container from '../../components/Container'; // Import the Container component
import DeleteModal from '../../components/Modals/DeleteModal';
import { BackHandler } from 'react-native';
import { deleteAppwriteDocument, ensureDocumentExists, getUserData, updateAppwriteDocument } from '../../services/appWrite';

const { height, width } = Dimensions.get('window'); // Get screen dimensions here

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [buttons, setButtons] = useState([]); // Initialize state with imported data
  const [selectedButton, setSelectedButton] = useState(null);

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleAddModal = () => setAddModalVisible(!addModalVisible);
  const toggleDeleteModal = () => setDeleteModalVisible(!deleteModalVisible);




  // Handle hardware back press to prevent going back
  useEffect(() => {
    const backAction = () => {
      // Prevent going back
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const [waterIntake, setWaterIntake] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usersId, setUserId] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        //console.log('Fetched user data:', data);
        setWaterIntake(data.documents[0].waterIntake);
        setUserId(data.documents[0].userId);
      } catch (error) {
        Alert.alert('Error', `Failed to load data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    if (usersId) {
      ensureDocumentExists(usersId)
        .then((document) => {
          console.log('Document ensured:', document);
          
          // Extract the buttons from the document
          const buttonsData = document.buttons ? document.buttons.map(button => JSON.parse(button)) : [];
  
          // Update the state with parsed buttons data
          setButtons(buttonsData);

          setDocumentId(document.$id);
         
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [usersId]);

  console.log("buttons :",buttons)
  const handlePress = () => {
    console.log('Drink button pressed');
  };

  const deleteButton = () => {
    toggleDeleteModal(); // Open the DeleteModal
  };

  const addButton = () => {
    toggleAddModal(); // Open the AddModal
  };

  const handleAddNewButton = async (newButton) => {
    try {
      // Update the Appwrite document with the new button (waiting for it to complete)
      await updateAppwriteDocument(newButton, documentId,buttons);
  
      // Once the document update is successful, update the buttons state
      setButtons((prevButtons) => [...prevButtons, newButton]); // Add new button to the state
    } catch (error) {
      console.error("Error updating Appwrite document:", error);
      // Optionally, handle errors (e.g., show an alert or log it)
    }
  };

  const handleDeleteButton = async (updatedData) => {
    try {
      // Update the Appwrite document with the updated buttons array
      await deleteAppwriteDocument(updatedData, documentId);
  
      // Update the local state with the new buttons
      setButtons(updatedData);
  
      // Close the modal
      toggleDeleteModal();
    } catch (error) {
      console.error('Error deleting button:', error);
    }
  };
  
  console.log(usersId);
  return (
    <View style={styles.view}>
      <ImageBackground
        source={require('../../assets/images/Home.png')}
        style={styles.backgroundImage}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : (
          waterIntake !== null && (
            <View style={styles.content}>
              <View style={styles.container}>
                <View style={styles.row}>
                  <Text style={styles.label}>Total Height:</Text>
                  <View style={styles.circle}>
                    {/* placeholder value*/}
                    <Text style={styles.value}>25 m</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Day Streak:</Text>
                  <View style={styles.circle}>
                    {/* placeholder value*/}
                    <Text style={styles.value}>0</Text>
                  </View>
                </View>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/images/Cloud.png')}
                  style={styles.cloudImage}
                />
                {/* placeholder percentage*/}
                <Text style={styles.overlayText}>55%</Text>
              </View>
              <Text style={styles.text}>
                Daily Goal: {waterIntake} ml
              </Text>
              <View style={styles.divider} />
              <Text style={styles.text}>
                xxx ml to go
              </Text>
              
                {/* Circle Button */}
      <TouchableOpacity style={styles.drinkButton} onPress={toggleModal}>
        <Image style={styles.icon} source={require('../../assets/icons/water-glass.png')} />
      </TouchableOpacity>

      {/* Modals */}
      <SelectableModal
        visible={modalVisible}
        data={buttons}
        onClose={toggleModal}
        onSelect={(item) => setSelectedButton(item) }
        onAdd={addButton}
        onDelete={deleteButton}
      />
      
      <AddWaterModal
        visible={addModalVisible}
        onClose={toggleAddModal}
        onSave={handleAddNewButton} // Pass handleAddNewButton to AddWaterModal to add a new button
      />

      <DeleteModal
        visible={deleteModalVisible}
        initialData={buttons}
        onClose={toggleDeleteModal}
        onDelete={handleDeleteButton}
      />
              
            </View>
          )
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginHorizontal: 50,
    borderRadius: 25,
    height: 140,
    // For iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // For Android shadow
    elevation: 10,
    marginBottom: 130,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 90
  },
  text: {
    fontSize: 18,
    color: '#000',
    paddingHorizontal: 20,
  },
  divider: {
    width: '70%',
    height: 1.5,
    backgroundColor: '#000',
    marginVertical: 2,
    marginStart: 20
  },
  streakText: {
    fontSize: 18,
    paddingBottom: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10
  },
  label: {
    fontSize: 20,
    color: '#000',
  },
  circle: {
    width: 80,
    height: 30,
    borderRadius: 25,
    backgroundColor: '#D9F5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cloudImage: {
    alignSelf: "center"
  },
  overlayText: {
    position: 'absolute',
    bottom: 35,
    right: 116,
    fontSize: 17,
    color: '#000',
  },
  drinkButton: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10, // For Android
    // Inner shadow simulation
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  drinkIcon: {
    width: 32,
    height: 37,
    resizeMode: 'contain',
  }
});


export default Home;
