import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import SelectableModal from '../../components/Modals/Modal';
import AddWaterModal from '../../components/Modals/AddModal';
import Container from '../../components/Container'; // Import the Container component
import DeleteModal from '../../components/Modals/DeleteModal';
import { BackHandler } from 'react-native';
import { deleteAppwriteDocument, ensureDocumentExists, getUserData, updateAppwriteDocument, waterIntakeManager } from '../../services/appWrite';
import SpriteAnimation from '../../components/SpriteAnimation';
import * as Notifications from 'expo-notifications';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import Cloud from '../../components/Cloud';

const { height, width } = Dimensions.get('window'); // Get screen dimensions here


const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [buttons, setButtons] = useState([]); // Initialize state with imported data
  const [selectedButton, setSelectedButton] = useState(null);
  const [waterIntake, setWaterIntake] = useState(null);
  const [currentIntakeState, setCurrentIntake] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);
  const [usersId, setUserId] = useState(null);
  const [documentId, setDocumentId] = useState(null);

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleAddModal = () => setAddModalVisible(!addModalVisible);
  const toggleDeleteModal = () => setDeleteModalVisible(!deleteModalVisible);

  const groundWidth = 50; // Set the width of one tile
  const numberOfTiles = Math.ceil(width / groundWidth); // Calculate the number of tiles needed to cover the screen

  const [fontsLoaded] = useFonts({
    'text': require('../../assets/fonts/text.ttf'),
  });
  const [fontsLoaded2] = useFonts({
    'ka1': require('../../assets/fonts/ka1.ttf'),
  });

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

  //Fetches user data
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

  
  const handlePress = async (item) => {
    // Set the selected button
    setSelectedButton(item);
  
    // Convert the selected amount (e.g., "500ml") to a number (500)
    const selectedAmount = parseInt(item.defaultSelected.replace('ml', ''), 10);
  
    // Get the current water intake from state (if tracking it in state)
    let currentIntake = currentIntakeState;  // You should have currentIntakeState in your component state
    
    // Add selected amount to the current intake
    currentIntake += selectedAmount;
  
    // Prevent exceeding the daily goal (waterIntake)
    if (currentIntake > waterIntake) {
      currentIntake = waterIntake;  // Ensure it doesn't exceed the goal
    }
  
    // Update the state with the new intake value
    setCurrentIntake(currentIntake);  // Set the new current intake value in state
    
    // Optionally, you could display a message when the goal is reached
    if (currentIntake >= waterIntake) {
      console.log('Daily water intake goal reached!');
    }
   // Call the waterIntakeManager function to update the Appwrite database
   try {
    const updatedDocument = await waterIntakeManager(usersId, currentIntake, waterIntake);
    console.log('Water intake data updated successfully:', updatedDocument.history);
  } catch (error) {
    console.error('Error updating water intake data:', error);
  }
 
  };
  console.log("Current water intake: ",currentIntakeState)
  


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
  

  return (
    
    <View style={styles.view}>
      <ImageBackground
        source={require('../../assets/images/bg2.png')}
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
                    <Text style={styles.value}>5 m</Text>
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
                {/*<Image
                  source={require('../../assets/images/Cloud.png')}
                  style={styles.cloudImage}
                />
               
                <Text style={styles.overlayText}>
                  {currentIntakeState > 0 ? `${Math.round((currentIntakeState / waterIntake) * 100)}%` : '0%'}
                </Text>*/}
                  <Cloud style={styles.cloud} currentIntakeState={currentIntakeState} waterIntake={waterIntake} />
    
              </View>

              <Text style={styles.text}>
                Daily Goal: {waterIntake} ml
              </Text>

              <View style={styles.divider} />

              <Text style={styles.text}>
                {currentIntakeState < waterIntake 
                  ? `${waterIntake - currentIntakeState} ml to go` 
                  : 'Goal reached!'}
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
                onSelect={handlePress}
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
        <View style={styles.imageWrapper}>
          <Image source={require('../../assets/images/initial_plant.png')} style={styles.image} />
          <View style={styles.groundWrapper}>
            {Array.from({ length: numberOfTiles }).map((_, index) => (
              <Image
                key={index}
                source={require('../../assets/images/Ground.png')}
                style={styles.groundImage}
              />
            ))}
          </View> 
        </View>
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
    justifyContent: 'center'
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
    fontFamily: 'ka1',
    fontSize: 17,
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
    fontSize: 21,
    fontWeight: 'bold',
    color: '#000',
    justifyContent: 'center',
    alignItems: 'center',
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
    zIndex: 1,
  },
  drinkIcon: {
    width: 32,
    height: 37,
    resizeMode: 'contain',
  },
  imageWrapper: {
    position: 'absolute', // Positions the image absolutely
    bottom: 0,            // Aligns it to the bottom of the screen
    left: 0,              // Ensures the wrapper stretches across the screen
    right: 0,             // Ensures the wrapper stretches across the screen
    alignItems: 'center', // Centers the image horizontally
    justifyContent: 'center', // Centers vertically within the wrapper (if needed)
    zIndex: 0,            // Ensures it's above other elements
  },
  image: {
    width: 200,           // Width of the image
    height: 200,          // Height of the image
    resizeMode: 'contain', // Ensures the image stays within its bounds
  },
  groundWrapper: {
    
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
   
  },
  groundImage: {
    
  
  },
  imageContainer: {
    flex: 1,  // Ensures the container takes up full height and width
    justifyContent: 'center', // Vertically centers the cloud
    alignItems: 'center', // Horizontally centers the cloud
    position: 'absolute',  // Ensures it's over other content
    top: 0,  // Optional: adjust positioning if needed
    left: 0,  // Optional: adjust positioning if needed
    right: 0, // Optional: adjust positioning if needed
    bottom: 0, // Optional: adjust positioning if needed
  },
  cloud: {
    width: 150, // Set the width of the cloud image
    height: 150, // Set the height of the cloud image
    resizeMode: 'contain', // Ensures the image scales appropriately
  },
});


export default Home;
