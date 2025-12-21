import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar, RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FoodScreen({ navigation }) { // Added navigation here
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 👇 CONNECTING TO YOUR REAL SERVER
  const API_URL = "https://yumigo-api.onrender.com"; 

  const fetchRestaurants = () => {
    console.log("Fetching from:", `${API_URL}/api/restaurant/list`); // Debug log
    
    fetch(`${API_URL}/api/restaurant/list`)
      .then((res) => res.json())
      .then((json) => {
        // console.log("Server Response:", json); // Debug log
        if (json.success) {
          setRestaurants(json.data);
        }
      })
      .catch((err) => console.error("Server Error:", err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  // Run this when screen loads
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurants();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🏙️ Live Restaurants</Text>
          <Text style={styles.headerSubtitle}>Real data from your Cloud</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={fetchRestaurants}>
           <Ionicons name="reload" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#FF9900" />
            <Text style={styles.loadingText}>Connecting to Server...</Text>
        </View>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          
          // 👇 What to show if the list is empty
          ListEmptyComponent={
            <View style={styles.center}>
                <Ionicons name="restaurant-outline" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No restaurants found.</Text>
                <Text style={styles.subText}>Go to the 'Seller' tab to add one!</Text>
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
                    <Text style={styles.ratingText}>New 🌟</Text>
                  </View>
                </View>

                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.address}> {item.address || "Hyderabad"}</Text>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.menuBtn}>
                  <Text style={styles.menuBtnText}>View Menu</Text>
                  <Ionicons name="arrow-forward" size={14} color="blue" />
                </TouchableOpacity>
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
  header: { padding: 20, backgroundColor: '#fff', elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  filterBtn: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8 },
  list: { padding: 15, paddingBottom: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  loadingText: { marginTop: 10, color: '#888' },
  emptyText: { marginTop: 10, fontSize: 18, fontWeight: 'bold', color: '#888' },
  subText: { marginTop: 5, color: '#aaa' },
  
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