import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { restaurants } from '../data/foodData'; // Import Data
import RestaurantCard from '../components/RestaurantCard'; // Import Component

export default function FoodScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hungry? 😋</Text>
      
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingTop: 50 },
  header: { fontSize: 28, fontWeight: 'bold', marginLeft: 20, marginBottom: 15 },
  list: { paddingHorizontal: 20, paddingBottom: 20 }
});