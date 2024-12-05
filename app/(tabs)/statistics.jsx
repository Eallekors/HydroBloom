import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '../../components/Container.jsx';
import Header from '../../components/Header.jsx';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getStatisticsData } from '../../services/appWrite';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;

const Statistics = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false); // New state to track "No data" case

  // Fetch statistics data
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setNoData(false); // Reset noData state on each fetch
  
      // Fetch statistics data from AppWrite
      const stats = await getStatisticsData();
  
      if (!stats || stats.length === 0) {
        setNoData(true); // Handle the case where no data is found
        return; // Return early if no data is found, avoiding further processing
      }
  
      // Process the statistics data (rest of your logic)
      const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
      // Get current date and calculate the start of the week (Monday)
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDay + 1);
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // set to Sunday
  
      // Create a dictionary of the last week's stats, mapping by day of the week
      const statsByDay = stats.reduce((acc, stat) => {
        stat.history.forEach((entry) => {
          const parsedEntry = JSON.parse(entry);
          const statDate = new Date(parsedEntry.day);
          const dayOfWeek = statDate.getDay();
  
          if (statDate >= startOfWeek && statDate <= endOfWeek) {
            const dayAmount = parseFloat(parsedEntry.dayAmount) / 1000 || 0;
            const correctedIndex = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
            acc[correctedIndex] = dayAmount;
          }
        });
  
        return acc;
      }, {});
  
      const data = weekLabels.map((_, index) => statsByDay[index] || 0);
  
      setChartData({
        labels: weekLabels,
        datasets: [{ data }],
      });
  
      // Parse and set history data
      const history = stats.flatMap((stat) => {
        return stat.history.map((entry) => {
          const parsedEntry = JSON.parse(entry);
          const date = new Date(parsedEntry.day);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
          });
  
          return {
            date: formattedDate,
            intake: parsedEntry.dayAmount || 0,
            percentage: Math.round((parsedEntry.dayAmount / parsedEntry.dayGoal) * 100) || 0,
            rawDate: date,
          };
        });
      });
  
      const sortedHistory = history.sort((a, b) => b.rawDate - a.rawDate);
      setHistoryData(sortedHistory);
  
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setNoData(true); // Handle the error and prevent the app from crashing
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch data every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchStatistics();
    }, [])
  );

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
      stroke: '#ffa726',
    },
    barPercentage: 0.4,
  };

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
            {/* Show loading indicator when fetching data */}
            {loading ? (
              <ActivityIndicator size="large" color="#8A2BE2" />
            ) : noData ? (
              <Text style={styles.noDataText}>No statistics found</Text> // Display no data message
            ) : (
              <>
                {/* Bar Chart */}
                <BarChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={220}
                  yAxisLabel=""
                  chartConfig={chartConfig}
                  yAxisSuffix=" l"
                  style={{ marginRight: 10 }}
                  fromZero={true}
                />

                {/* History Section */}
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
              </>
            )}
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
    flex: 1,
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
    flex: 1,
  },
  historyIntake: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    paddingLeft: 10,
  },
  historyPercentage: {
    fontSize: 16,
    color: '#333',
    flex: 0.5,
    textAlign: 'right',
    paddingRight: 30,
  },
  noDataText: {
    fontSize: 18,
    color: '#8A2BE2',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Statistics;
