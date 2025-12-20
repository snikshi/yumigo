import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SellerScreen() {
  const { user } = useAuth();
  const [mode, setMode] = useState('REGISTER'); // 'REGISTER' or 'ADD_FOOD'
  
  // Restaurant Form
  const [restName, setRestName] = useState('');
  const [restAddress, setRestAddress] = useState('');
  const [restImage, setRestImage] = useState('https://via.placeholder.com/150');
  const [myRestaurantId, setMyRestaurantId] = useState(null); // Saves ID after registering

  // Food Form
  const [foodName, setFoodName] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodImage, setFoodImage] = useState('https://via.placeholder.com/150');
  const [foodCategory, setFoodCategory] = useState('Burger');

  const API_URL = "https://yumigo-api.onrender.com"; // CHECK YOUR URL!

  // 1. Register Restaurant Function
  const handleRegisterRestaurant = async () => {
    try {
      const response = await fetch(`${API_URL}/api/partner/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: user._id, // Uses your logged-in ID
          name: restName,
          address: restAddress,
          image: restImage
        })
      });
      const json = await response.json();
      if (json.success) {
        Alert.alert("Success", "Restaurant Created!");
        setMyRestaurantId(json.data._id); // Save the ID so we can add food to it
        setMode('ADD_FOOD'); // Switch to food mode
      } else {
        Alert.alert("Error", json.error || "Failed to register");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // 2. Add Food Function
  const handleAddFood = async () => {
    if (!myRestaurantId) {
      Alert.alert("Error", "You must register a restaurant first!");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/partner/add-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: myRestaurantId,
          name: foodName,
          price: Number(foodPrice),
          image: foodImage,
          category: foodCategory
        })
      });
      const json = await response.json();
      if (json.success) {
        Alert.alert("Success", "Food Item Added!");
        // Clear form
        setFoodName('');
        setFoodPrice('');
      } else {
        Alert.alert("Error", json.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>👨‍🍳 Partner Dashboard</Text>
      
      {/* TOGGLE BUTTONS (Optional if you want to switch back manually) */}
      <View style={{flexDirection:'row', marginBottom: 20}}>
        <Button title="Register Restaurant" onPress={()=>setMode('REGISTER')} disabled={mode==='REGISTER'} />
        <View style={{width:10}}/>
        <Button title="Add Food" onPress={()=>setMode('ADD_FOOD')} disabled={mode==='ADD_FOOD'} />
      </View>

      {mode === 'REGISTER' ? (
        <View style={styles.form}>
          <Text style={styles.subHeader}>Step 1: Create Restaurant</Text>
          <TextInput placeholder="Restaurant Name" style={styles.input} value={restName} onChangeText={setRestName} />
          <TextInput placeholder="Address" style={styles.input} value={restAddress} onChangeText={setRestAddress} />
          <TextInput placeholder="Image URL" style={styles.input} value={restImage} onChangeText={setRestImage} />
          <Button title="Register Now" onPress={handleRegisterRestaurant} color="green" />
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.subHeader}>Step 2: Add Menu Items</Text>
          <Text style={{color:'gray', marginBottom:10}}>Adding to: {restName}</Text>
          
          <TextInput placeholder="Food Name (e.g. Cheese Burger)" style={styles.input} value={foodName} onChangeText={setFoodName} />
          <TextInput placeholder="Price (USD)" keyboardType="numeric" style={styles.input} value={foodPrice} onChangeText={setFoodPrice} />
          <TextInput placeholder="Food Image URL" style={styles.input} value={foodImage} onChangeText={setFoodImage} />
          <TextInput placeholder="Category (Burger, Pizza...)" style={styles.input} value={foodCategory} onChangeText={setFoodCategory} />
          
          <Button title="Add Item" onPress={handleAddFood} color="#FF9900" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#444' },
  form: { backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 3 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 5, fontSize: 16 }
});