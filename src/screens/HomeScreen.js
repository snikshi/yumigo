import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Button } from 'react-native';
import { useCart } from '../context/CartContext'; // <--- Enables Cart
import { formatPrice } from '../helpers/currency'; // <--- Enables Rupees (₹)

export default function HomeScreen() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); 

  // CHECK YOUR RENDER URL!
  const API_URL = "https://yumigo-api.onrender.com";

  const fetchFood = async () => {
    try {
      const response = await fetch(`${API_URL}/api/food/list`);
      const json = await response.json();
      if (json.success) setFoods(json.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFood(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍔 Yumigo Menu</Text>

      {loading ? <ActivityIndicator size="large" color="orange" /> : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.name}</Text>
                
                {/* 👇 1. SHOWS ₹ INSTEAD OF $ */}
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
                
                {/* 👇 2. ADDS THE BUTTON */}
                <View style={{ marginTop: 10 }}>
                    <Button title="Add to Cart" onPress={() => addToCart(item)} color="#FF9900"/>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10, marginTop: 30 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: '#fff', borderRadius: 15, marginBottom: 15, padding: 10 },
  image: { width: '100%', height: 150, borderRadius: 10 },
  info: { marginTop: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  price: { fontSize: 18, color: 'green', fontWeight: 'bold' }
});