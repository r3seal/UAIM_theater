import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, StyleSheet, Platform, ScrollView} from 'react-native';

const ReportScreen = ({ route, navigation }) => {
  const { data } = route.params;
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (data) {
      setReportData(data);
    }
  }, [data]);

  const renderSeatItem = ({ item }) => (
    <View style={styles.seatItem}>
      <Text style={styles.text}>Row: {item.row}</Text>
      <Text style={styles.text}>Seat Number: {item.seat_number}</Text>
      <Text style={styles.text}>Times Selected: {item.times_selected}</Text>
    </View>
  );

  const renderSoldTicketsItem = ({ item }) => (
    <View style={styles.spectacleItem}>
      <Text style={styles.text}>Spectacle: {item.spectacle_name}</Text>
      <Text style={styles.text}>Tickets Sold: {item.tickets_sold}</Text>
    </View>
  );

  if (!reportData) {
    return <Text style={styles.text}>Loading...</Text>;
  }

  return (
      <View style={styles.container}>
        <View style={styles.dataContainer}>
        <Text style={styles.title}>Most Popular Seats</Text>
        <FlatList
          data={reportData.most_popular_seats}
          renderItem={renderSeatItem}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text style={styles.title}>Least Popular Seats</Text>
        <FlatList
          data={reportData.least_popular_seats}
          renderItem={renderSeatItem}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text style={styles.title}>Sold Tickets Per Spectacle</Text>
        {reportData.sold_tickets_per_spectacle.length > 0 ? (
        <FlatList
          data={reportData.sold_tickets_per_spectacle}
          renderItem={renderSoldTicketsItem}
          keyExtractor={(item, index) => index.toString()}
        />
        ) : (
          <Text style={styles.text}>No tickets sold for any spectacle.</Text>
        )}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F3F',
      overflowY: Platform.select({
      web: 'auto',
      default: 'hidden',
    }),
    maxHeight: '100vh'
  },
  dataContainer: {
    width: Platform.select({
      web: '50%',
      default: '100%'
    }),
    padding: 16,
    flex: 1,
    backgroundColor: '#001F3F',
    margin: 'auto',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#FFFFFF',
  },
  seatItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#002D62',
    borderColor: '#ddd',
  },
  text: {
    color: '#FFFFFF',
  },
});

export default ReportScreen;
