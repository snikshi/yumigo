import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Button } from 'react-native';

export default function HomeScreen() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null); // Store the error text

  // 👇 VERIFY THIS LINK IS CORRECT
  const API_URL = "https://yumigo-api.onrender.com"; 

  const fetchFood = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      console.log("Fetching from:", `${API_URL}/api/food/list`);
      const response = await fetch(`${API_URL}/api/food/list`);
      
      if (!response.ok) {
        throw new Error(`Server Status: ${response.status}`);
      }

      const json = await response.json();
      
      if (json.success) {
        setFoods(json.data);
      } else {
        setErrorMsg("Server said success: false");
      }
    } catch (error) {
      // Show the actual error on the phone screen
      setErrorMsg(error.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFood();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍔 Yumigo Menu</Text>

      {/* ERROR BOX: Only shows if there is an error */}
      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ ERROR:</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Button title="Retry" onPress={fetchFood} />
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="orange" />
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>${item.price}</Text>
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
  errorBox: { backgroundColor: '#ffcccc', padding: 15, borderRadius: 10, marginBottom: 20 },
  errorText: { color: 'red', fontSize: 16, marginBottom: 5 },
  card: { backgroundColor: '#fff', borderRadius: 15, marginBottom: 15, padding: 10 },
  image: { width: '100%', height: 150, borderRadius: 10 },
  info: { marginTop: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  price: { fontSize: 18, color: 'green', fontWeight: 'bold' }
});