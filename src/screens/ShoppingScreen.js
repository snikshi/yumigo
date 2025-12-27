import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, 
  Dimensions, ScrollView, ActivityIndicator, Alert, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext'; 

const { width } = Dimensions.get('window');

export default function ShoppingScreen() {
  const navigation = useNavigation();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 API URL (Change if using Real Device)
  const API_URL = "https://yumigo-api.onrender.com/api/products"; 

  // 1. FETCH PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/list`);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. DEMO DATA LOADER
  const loadDemoData = async () => {
    const demoItems = [
      { name: "Sony XM4 Headphones", category: "Electronics", price: 19999, oldPrice: 24999, image: "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg", tags: ["music", "bass"] },
      { name: "Nike Air Jordan", category: "Fashion", price: 12499, oldPrice: 15999, image: "https://m.media-amazon.com/images/I/81xXj2j2+UL._AC_UY1000_.jpg", tags: ["shoes", "cool"] },
      { name: "Apple Watch Series 8", category: "Electronics", price: 34999, oldPrice: 45900, image: "https://m.media-amazon.com/images/I/71XMTLtZd5L._AC_SX679_.jpg", tags: ["smart", "tech"] },
      { name: "Puma Running Tee", category: "Fashion", price: 899, oldPrice: 1499, image: "https://m.media-amazon.com/images/I/71K1j1kVwCL._AC_UL1500_.jpg", tags: ["gym", "fit"] },
      { name: "Gaming Mouse Logitech", category: "Electronics", price: 2499, oldPrice: 3999, image: "https://resource.logitech.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/g502-hero/gallery/g502-hero-gallery-1.png?v=1", tags: ["gaming", "pc"] },
      { name: "RayBan Aviator", category: "Fashion", price: 6599, oldPrice: 8999, image: "https://india.ray-ban.com/media/catalog/product/0/r/0rb3025i_001_58_0_11zon.png", tags: ["sun", "style"] },
    ];

    Alert.alert("Adding Data...", "Please wait while we stock the shop!");
    
    for (const item of demoItems) {
      await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
      });
    }
    
    Alert.alert("Success", "Shop Stocked! Reloading...");
    fetchProducts();
  };

  // 3. RENDER PRODUCT CARD (Updated with Navigation)
  const renderProduct = ({ item }) => (
    <TouchableOpacity 
        style={styles.card}
        // 👇 This opens the Detail Screen
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      {/* Discount Badge */}
      {item.oldPrice && (
        <View style={styles.badge}>
            <Text style={styles.badgeText}>
                {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% OFF
            </Text>
        </View>
      )}

      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            {item.oldPrice && <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>}
        </View>
        
        {/* Quick Add Button */}
        <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => {
                addToCart(item);
                Alert.alert("Added", `${item.name} in Cart 🛒`);
            }}
        >
            <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#232f3e" />
      
      {/* AMAZON-STYLE HEADER */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#000" />
            <Text style={{color: '#777', marginLeft: 10}}>Search ...</Text>
        </View>
        <Ionicons name="cart-outline" size={28} color="#fff" style={{marginLeft: 15}} onPress={() => navigation.navigate('Cart')}/>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 1. FLASH DEALS RAIL */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Flash Deals</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Image source={{ uri: "https://m.media-amazon.com/images/I/61TD5JLGhIL._SX3000_.jpg" }} style={styles.banner} />
                <Image source={{ uri: "https://m.media-amazon.com/images/I/71tIrZqybrL._SX3000_.jpg" }} style={styles.banner} />
            </ScrollView>
        </View>

        {/* 2. PRODUCT GRID */}
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        
        {loading ? (
            <ActivityIndicator size="large" color="#232f3e" style={{marginTop: 50}} />
        ) : products.length === 0 ? (
            <View style={styles.emptyState}>
                <Text>Shop is empty! 😱</Text>
                <TouchableOpacity style={styles.demoBtn} onPress={loadDemoData}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Load Demo Products</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={item => item._id}
                numColumns={2}
                columnWrapperStyle={{justifyContent: 'space-between', paddingHorizontal: 10}}
                scrollEnabled={false} 
            />
        )}
        
        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: { backgroundColor: '#232f3e', padding: 15, paddingTop: 40, flexDirection: 'row', alignItems: 'center' },
  searchBar: { flex: 1, backgroundColor: '#fff', flexDirection: 'row', padding: 10, borderRadius: 8, alignItems: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', margin: 15, color: '#333' },
  banner: { width: 300, height: 150, borderRadius: 10, marginLeft: 15 },
  
  // Product Card
  card: { width: (width / 2) - 15, backgroundColor: '#fff', borderRadius: 8, marginBottom: 15, padding: 10, elevation: 3 },
  image: { width: '100%', height: 120, marginBottom: 10 },
  info: { flex: 1 },
  name: { fontSize: 14, color: '#333', marginBottom: 5, height: 40 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  oldPrice: { fontSize: 12, color: '#999', textDecorationLine: 'line-through', marginLeft: 8 },
  badge: { position: 'absolute', top: 5, left: 5, backgroundColor: '#cc0c39', padding: 4, borderRadius: 4, zIndex: 1 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  
  addBtn: { backgroundColor: '#f0c14b', padding: 8, borderRadius: 5, alignItems: 'center', borderColor: '#a88734', borderWidth: 1 },
  addText: { color: '#111', fontSize: 12, fontWeight: 'bold' },

  emptyState: { alignItems: 'center', marginTop: 50 },
  demoBtn: { backgroundColor: '#232f3e', padding: 15, borderRadius: 10, marginTop: 20 }
});