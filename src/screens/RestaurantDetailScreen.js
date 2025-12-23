import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCart } from '../context/CartContext'; 

export default function RestaurantDetailScreen({ route, navigation }) {
  // 1. Safe Data Loading with Defaults
  const params = route.params || {};
  const restaurant = params.restaurant || {};
  
  // 2. Get Cart Tools
  const { addToCart, cart } = useCart(); 

  // 3. Ultra-Safe Menu Loading
  // If restaurant.menu is missing, use an empty array []
  const menu = restaurant.menu || []; 

  // 4. Render a single menu item
  const renderItem = ({ item }) => (
    <View style={styles.menuItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.dishName}>{item?.name || "Unknown Item"}</Text>
        <Text style={styles.dishPrice}>₹{item?.price || 0}</Text>
        <Text style={styles.dishDesc}>{item?.description || ""}</Text>
      </View>
      <TouchableOpacity 
        style={styles.addBtn}
        onPress={() => {
            addToCart(item, restaurant);
            Alert.alert("Added", `${item.name} added to cart! 🛒`);
        }}
      >
        <Text style={styles.addText}>ADD</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <Image 
        source={{ uri: restaurant.image || 'https://via.placeholder.com/300' }} 
        style={styles.image} 
      />
      
      {/* Restaurant Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{restaurant.name || "Unknown Restaurant"}</Text>
        <Text style={styles.details}>
          {restaurant.cuisine || "Food"} • ⭐ {restaurant.rating || "4.0"} • {restaurant.time || "30"} mins
        </Text>
      </View>

      {/* Menu List */}
      <Text style={styles.menuTitle}>Menu ({menu.length} items)</Text>
      
      <FlatList
        data={menu}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
            <Text style={{textAlign: 'center', marginTop: 20, color: '#888'}}>
                No menu items available.
            </Text>
        }
      />

      {/* View Cart Button */}
      {cart.length > 0 && (
          <TouchableOpacity style={styles.viewCartBtn} onPress={() => navigation.navigate('Cart')}>
              <Text style={styles.viewCartText}>View Cart ({cart.length})</Text>
          </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 200 },
  infoContainer: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontSize: 24, fontWeight: 'bold' },
  details: { color: '#666', marginTop: 5 },
  menuTitle: { fontSize: 20, fontWeight: 'bold', padding: 20 },
  menuItem: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center' },
  dishName: { fontSize: 18, fontWeight: 'bold' },
  dishPrice: { fontSize: 16, color: '#333', marginTop: 4 },
  dishDesc: { color: '#888', fontSize: 12, marginTop: 4 },
  addBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: 'green', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5 },
  addText: { color: 'green', fontWeight: 'bold' },
  viewCartBtn: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: 'green', padding: 15, borderRadius: 10, alignItems: 'center' },
  viewCartText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});