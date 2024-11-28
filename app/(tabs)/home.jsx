import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import SelectableModal from '../../components/Modals/Modal';
import AddWaterModal from '../../components/Modals/AddModal';
import Container from '../../components/Container'; // Import the Container component
import buttonsData from '../../data/contrainers.json'; // Import JSON data
import DeleteModal from '../../components/Modals/DeleteModal';
import { BackHandler } from 'react-native';
import { getUserData } from '../../services/appWrite';

const { height, width } = Dimensions.get('window'); // Get screen dimensions here

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [buttons, setButtons] = useState(buttonsData); // Initialize state with imported data
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        console.log('Fetched user data:', data);
        setWaterIntake(data.waterIntake);
      } catch (error) {
        Alert.alert('Error', `Failed to load data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePress = () => {
    console.log('Drink button pressed');
  };

  const deleteButton = () => {
    toggleDeleteModal(); // Open the DeleteModal
  };

  const addButton = () => {
    toggleAddModal(); // Open the AddModal
  };

  const handleAddNewButton = (newButton) => {
    setButtons((prevButtons) => [...prevButtons, newButton]); // Add new button to the state
    
  };
  console.log(buttons);
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
              <Pressable
                style={({ pressed }) => [
                  styles.drinkButton,
                  { opacity: pressed ? 0.9 : 1 }
                ]}
                onPress={handlePress}
              >
                {/* Circle Button */}
      <TouchableOpacity style={styles.circleButton} onPress={toggleModal}>
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
        onDelete={(updatedData) => setButtons(updatedData)}
      />
              </Pressable>
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
