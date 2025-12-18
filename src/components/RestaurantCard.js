import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // <--- Import this

export default function RestaurantCard({ restaurant }) {
  const navigation = useNavigation(); // <--- Activate navigation

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      // 👇 This tells the app: "Go to Detail Screen and take this restaurant's info with you"
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant })} 
    >
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.row}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <View style={styles.ratingBox}>
                <Text style={styles.rating}>{restaurant.rating} ★</Text>
            </View>
        </View>
        <Text style={styles.tags}>{restaurant.tags.join(' • ')}</Text>
        <Text style={styles.time}>{restaurant.time} • Delivery</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 15, marginBottom: 20, overflow: 'hidden', elevation: 3 },
  image: { width: '100%', height: 200 },
  info: { padding: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  ratingBox: { backgroundColor: 'green', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  rating: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  tags: { color: 'gray', marginVertical: 5 },
  time: { fontSize: 12, color: '#555' }
});