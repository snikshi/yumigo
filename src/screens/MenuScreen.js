import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, 
  StatusBar, ActivityIndicator, Alert 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

export default function MenuScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { addToCart } = useCart();
  
  // 📥 Get the Restaurant data passed from Home
  const { restaurant } = route.params || {};

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 FETCH REAL MENU FROM SERVER
  useEffect(() => {
    if (restaurant?._id) {
        fetch(`https://yumigo-api.onrender.com/api/food/restaurant/${restaurant._id}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                setMenu(json.data);
            }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [restaurant]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 🖼️ Restaurant Cover Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant?.image || 'https://via.placeholder.com/500' }} style={styles.coverImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.overlay} />
        <View style={styles.headerInfo}>
            <Text style={styles.restaurantName}>{restaurant?.name || "Restaurant"}</Text>
            <Text style={styles.restaurantMeta}>{restaurant?.address || "Hyderabad"} • 4.5 ⭐</Text>
        </View>
      </View>

      {/* 📋 Menu List */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Menu</Text>
        
        {loading ? (
            <ActivityIndicator size="large" color="#FF9900" style={{marginTop: 50}} />
        ) : (
            <FlatList
                data={menu}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <View style={{alignItems: 'center', marginTop: 50}}>
                        <Text style={{color: '#888'}}>No food items added yet. 🍳</Text>
                        <Text style={{color: '#ccc', fontSize: 12}}>Add them in the Seller Tab!</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.menuItem}>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>₹{item.price}</Text>
                            <Text style={styles.itemDesc}>{item.description || "Fresh and tasty!"}</Text>
                        </View>
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.itemImage} />
                            <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                                <Text style={styles.addText}>ADD +</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: { height: 250, position: 'relative' },
  coverImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  backButton: { position: 'absolute', top: 40, left: 20, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)' },
  headerInfo: { position: 'absolute', bottom: 20, left: 20 },
  restaurantName: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  restaurantMeta: { color: '#ddd', fontSize: 14, marginTop: 5 },

  menuContainer: { flex: 1, backgroundColor: '#fff', marginTop: -20, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
  menuTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  
  menuItem: { flexDirection: 'row', marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 15 },
  itemInfo: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  itemPrice: { fontSize: 16, color: '#333', marginTop: 5 },
  itemDesc: { color: '#888', fontSize: 12, marginTop: 5 },
  
  imageWrapper: { alignItems: 'center', position: 'relative' },
  itemImage: { width: 100, height: 100, borderRadius: 15 },
  addButton: { position: 'absolute', bottom: -10, backgroundColor: '#fff', borderWidth: 1, borderColor: 'green', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10, elevation: 2 },
  addText: { color: 'green', fontWeight: 'bold', fontSize: 12 }
});