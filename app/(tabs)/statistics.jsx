import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '../../components/Container.jsx';
import Header from '../../components/Header.jsx';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

const Statistics = () => {

  // Sample data for water intake (in Liters)
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [1, 1.5, 2, 0.8, 1.2, 1.7, 2],
      }
    ]
  };

  // Chart configuration object
  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(128, 0, 128, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726'
    },
    barPercentage: 0.4
  };

  // Sample data for history rows
  const historyData = [
    { date: '19 Sep', intake: 2000, percentage: 98 },
    { date: '18 Sep', intake: 1800, percentage: 90 },
    { date: '17 Sep', intake: 2200, percentage: 100 },
    { date: '16 Sep', intake: 1500, percentage: 75 },
    
  ];

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#83D2F6', '#D9F5FF', '#83D2F6']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradientContainer}
      >
        <Container style={styles.container}>
          <Header title="Water intake" />
          <View style={{ height: 20 }} />
          <ScrollView contentContainerStyle={styles.scrollContainer}>

            {/* Bar Chart */}
            <BarChart
              data={data}
              width={screenWidth - 40}
              height={220}
              yAxisLabel=""
              chartConfig={chartConfig}
              yAxisSuffix=" l"
              style={{ marginRight: 10 }}
              fromZero={true}
            />
            
            { /* History Section */}
            <Header title="History" />
            <View style={{ height: 20 }} />
            
            {/* Render history rows dynamically */}
            <ScrollView>
            {historyData.map((item, index) => (
              <View key={index} style={styles.historyRow}>
                <Text style={styles.historyDate}>{item.date}</Text>
                <Text style={styles.historyIntake}>{item.intake} ml</Text>
                <Text style={styles.historyPercentage}>{item.percentage}%</Text>
              </View>
            ))}
          </ScrollView>

          </ScrollView>
        </Container>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    alignItems: 'center',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth - 40,
    padding: 10,
    paddingLeft: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  
  historyIntake: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    paddingLeft: 10
  },
  
  historyPercentage: {
    fontSize: 16,
    color: '#333',
    flex: 0.5,
    textAlign: 'right',
    paddingRight: 30
  }
});

export default Statistics;
