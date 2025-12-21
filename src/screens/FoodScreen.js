import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  SafeAreaView, StatusBar, TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FoodScreen() {
  // 👇 WE ARE USING "MOCK DATA" FOR DESIGN MODE 🎨
  // This guarantees the screen never crashes!
  const [restaurants] = useState([
    {
      _id: '1',
      name: 'The Burger Club',
      rating: '4.8',
      time: '25-30 mins',
      offer: '50% OFF up to ₹100',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500',
      address: 'Jubilee Hills, Hyderabad'
    },
    {
      _id: '2',
      name: 'Pizza Paradise',
      rating: '4.3',
      time: '40-45 mins',
      offer: 'Free Coke on orders > ₹500',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500',
      address: 'Hitech City, Hyderabad'
    },
    {
      _id: '3',
      name: 'Biryani House',
      rating: '4.9',
      time: '30-35 mins',
      offer: 'Flat 20% OFF',
      image: 'https://b.zmtcdn.com/data/dish_photos/d35/b4728f3259836528731309f7a6372d35.jpg',
      address: 'Banjara Hills, Hyderabad'
    }
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🏙️ Top Restaurants</Text>
          <Text style={styles.headerSubtitle}>Featured places in Hyderabad</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
           <Ionicons name="options-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* IMAGE SECTION */}
            <View>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={styles.offerBadge}>
                    <Text style={styles.offerText}>{item.offer}</Text>
                </View>
            </View>
            
            {/* INFO SECTION */}
            <View style={styles.infoContainer}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{item.rating} <Ionicons name="star" size={10} color="#fff" /></Text>
                </View>
              </View>

              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.address}> {item.address}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { padding: 20, backgroundColor: '#fff', elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  filterBtn: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8 },
  
  list: { padding: 15 },
  
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  image: { width: '100%', height: 180 },
  
  timeBadge: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  timeText: { fontSize: 12, fontWeight: 'bold', color: '#333' },

  offerBadge: { position: 'absolute', top: 15, left: 0, backgroundColor: '#256FEF', paddingHorizontal: 10, paddingVertical: 5, borderTopRightRadius: 6, borderBottomRightRadius: 6 },
  offerText: { color: '#fff', fontWeight: 'bold', fontSize: 10, textTransform: 'uppercase' },
  
  infoContainer: { padding: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  ratingBadge: { backgroundColor: '#24963F', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  address: { color: '#777', fontSize: 13 },
  
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  menuBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  menuBtnText: { color: 'blue', fontSize: 13, fontWeight: '600', marginRight: 5 }
});