import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar, 
  RefreshControl, TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // 👈 IMPORT NAVIGATION

export default function FoodScreen() {
  const navigation = useNavigation(); // 👈 USE NAVIGATION HOOK
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = "https://yumigo-api.onrender.com"; 

  const fetchRestaurants = () => {
    fetch(`${API_URL}/api/restaurant/list`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setRestaurants(json.data);
          setFilteredRestaurants(json.data);
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

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const newData = restaurants.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        return itemData.includes(text.toUpperCase());
      });
      setFilteredRestaurants(newData);
    } else {
      setFilteredRestaurants(restaurants);
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
        
        {/* Search Bar */}
        <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" style={{marginRight: 10}} />
            <TextInput 
                style={styles.input}
                placeholder="Search restaurants..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#FF9900" />
        </View>
      ) : (
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            // 👇 THIS WAS THE MISSING PART!
            <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('Menu', { restaurant: item })}
            >
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

                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.address}> {item.address || "Hyderabad"}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.menuBtn}>
                  <Text style={styles.menuBtnText}>View Menu</Text>
                  <Ionicons name="arrow-forward" size={14} color="blue" />
                </View>
              </View>
            </TouchableOpacity>
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
  searchBar: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 12, padding: 12, alignItems: 'center' },
  input: { flex: 1, fontSize: 16, color: '#333' },
  list: { padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, overflow: 'hidden', elevation: 4 },
  image: { width: '100%', height: 180 },
  infoContainer: { padding: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  ratingBadge: { backgroundColor: '#24963F', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  ratingText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  address: { color: '#777', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  menuBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  menuBtnText: { color: 'blue', fontSize: 13, fontWeight: '600', marginRight: 5 }
});