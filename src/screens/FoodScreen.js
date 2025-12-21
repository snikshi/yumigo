import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar, 
  RefreshControl, TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FoodScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); // 👈 NEW: Holds the search results
  const [searchQuery, setSearchQuery] = useState(''); // 👈 NEW: Holds what you type
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = "https://yumigo-api.onrender.com"; 

  const fetchRestaurants = () => {
    fetch(`${API_URL}/api/restaurant/list`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setRestaurants(json.data);
          setFilteredRestaurants(json.data); // Initially, show everything
        }
      })
      .catch((err) => console.error("Server Error:", err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 👇 NEW: The Search Logic
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const newData = restaurants.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1; // Does the name contain the text?
      });
      setFilteredRestaurants(newData);
    } else {
      setFilteredRestaurants(restaurants); // If empty, show all
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurants();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Find Food 🍔</Text>
        
        {/* 👇 NEW: Search Bar UI */}
        <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" style={{marginRight: 10}} />
            <TextInput 
                style={styles.input}
                placeholder="Search restaurants..."
                value={searchQuery}
                onChangeText={(text) => handleSearch(text)}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                    <Ionicons name="close-circle" size={20} color="#ccc" />
                </TouchableOpacity>
            )}
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#FF9900" />
        </View>
      ) : (
        <FlatList
          data={filteredRestaurants} // 👈 We render the FILTERED list, not the full one
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.center}>
                <Text style={styles.emptyText}>No restaurants found matching "{searchQuery}"</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image 
                source={{ uri: item.image || 'https://via.placeholder.com/300' }} 
                style={styles.image} 
              />
              <View style={styles.infoContainer}>
                <View style={styles.row}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>4.5 🌟</Text>
                  </View>
                </View>
                <Text style={styles.address}>{item.address || "Hyderabad"}</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  headerContainer: { padding: 20, backgroundColor: '#fff', elevation: 4, paddingBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  
  // Search Bar Styles
  searchBar: { 
      flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 12, 
      padding: 12, alignItems: 'center' 
  },
  input: { flex: 1, fontSize: 16, color: '#333' },

  list: { padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#888', fontStyle: 'italic' },
  
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, overflow: 'hidden', elevation: 4 },
  image: { width: '100%', height: 180 },
  infoContainer: { padding: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  ratingBadge: { backgroundColor: '#24963F', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  ratingText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  address: { color: '#777', fontSize: 13 },
});