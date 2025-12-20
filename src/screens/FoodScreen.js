import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Button } from 'react-native';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../helpers/currency'; // <--- The Rupee Fix 🇮🇳

export default function FoodScreen() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const API_URL = "https://yumigo-api.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/api/food/list`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setFoods(json.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍽️ All Menu Items</Text>
      {loading ? <ActivityIndicator size="large" color="orange" /> : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.name}</Text>
                {/* 👇 DISPLAYS RUPEES NOW */}
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
                <Button title="Add to Cart" onPress={() => addToCart(item)} color="#FF9900" />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, marginTop: 40, backgroundColor: '#f9f9f9' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  card: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, padding: 10, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 40, marginRight: 15 },
  info: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, color: 'green', marginBottom: 5, fontWeight: 'bold' }
});