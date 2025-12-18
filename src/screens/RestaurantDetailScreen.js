import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext'; // <--- Import the Brain

export default function RestaurantDetailScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const { addToCart, cart } = useCart(); // <--- Get the addToCart function

  // Wrapper function to handle adding
  const handleAddItem = (item) => {
    addToCart(item);
    Alert.alert("Yum! 😋", `${item.name} added to cart!`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* Header Image */}
      <View>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>{restaurant.name}</Text>
        <Text style={styles.info}>⭐ {restaurant.rating} • 🕒 {restaurant.time}</Text>
        
        {/* Cart Counter (Temporary Debug) */}
        <Text style={{color: 'red', fontWeight: 'bold', marginTop: 10}}>
            Items in Cart: {cart.length}
        </Text>

        <Text style={styles.sectionTitle}>Full Menu</Text>

        {/* Menu Items with Add Logic */}
        <MenuItem 
            name="Classic Burger" 
            price={5.99} 
            onAdd={() => handleAddItem({ id: 1, name: "Classic Burger", price: 5.99, restaurantId: restaurant.id })} 
        />
        <MenuItem 
            name="Large Fries" 
            price={2.99} 
            onAdd={() => handleAddItem({ id: 2, name: "Large Fries", price: 2.99, restaurantId: restaurant.id })} 
        />
        <MenuItem 
            name="Coke Zero" 
            price={1.50} 
            onAdd={() => handleAddItem({ id: 3, name: "Coke Zero", price: 1.50, restaurantId: restaurant.id })} 
        />

      </ScrollView>
    </View>
  );
}

// Simple Sub-Component for clean code
const MenuItem = ({ name, price, onAdd }) => (
    <View style={styles.menuItem}>
        <View>
            <Text style={styles.foodName}>{name}</Text>
            <Text style={styles.price}>${price}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Text style={styles.addText}>ADD</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
  image: { width: '100%', height: 250 },
  backButton: { position: 'absolute', top: 40, left: 20, backgroundColor: 'white', padding: 8, borderRadius: 20 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  info: { fontSize: 16, color: 'gray', marginVertical: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  foodName: { fontSize: 16, fontWeight: '600' },
  price: { color: 'green', fontWeight: 'bold' },
  addButton: { backgroundColor: '#FF4B3A', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 },
  addText: { color: 'white', fontWeight: 'bold' }
});