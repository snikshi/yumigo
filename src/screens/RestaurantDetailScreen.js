import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, 
  FlatList, Switch, Animated, StatusBar, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext'; 
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function RestaurantDetailScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const { addToCart, cartItems } = useCart();
  const { colors, isDarkMode } = useTheme();

  const [isVeg, setIsVeg] = useState(false);
  const [menu, setMenu] = useState([]);

  // 1. GENERATE DUMMY MENU (Since API might not have full menu)
  useEffect(() => {
    const dummyMenu = [
        { id: '1', name: 'Paneer Butter Masala', price: 240, type: 'veg', rating: 4.5, image: 'https://source.unsplash.com/100x100/?curry' },
        { id: '2', name: 'Chicken Biryani', price: 320, type: 'non-veg', rating: 4.8, image: 'https://source.unsplash.com/100x100/?biryani' },
        { id: '3', name: 'Garlic Naan', price: 40, type: 'veg', rating: 4.2, image: 'https://source.unsplash.com/100x100/?naan' },
        { id: '4', name: 'Tandoori Chicken', price: 380, type: 'non-veg', rating: 4.6, image: 'https://source.unsplash.com/100x100/?chicken' },
        { id: '5', name: 'Gulab Jamun', price: 80, type: 'veg', rating: 4.9, image: 'https://source.unsplash.com/100x100/?sweet' },
    ];
    setMenu(dummyMenu);
  }, []);

  // Filter Logic
  const filteredMenu = isVeg ? menu.filter(item => item.type === 'veg') : menu;

  // Calculate Total in Cart for this restaurant
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const renderMenuItem = ({ item }) => (
    <View style={[styles.menuItem, { borderBottomColor: isDarkMode ? '#333' : '#f0f0f0' }]}>
        <View style={{flex: 1, paddingRight: 10}}>
            {/* Veg/Non-Veg Icon */}
            <View style={[styles.vegIconBorder, { borderColor: item.type === 'veg' ? 'green' : 'red' }]}>
                <View style={[styles.vegIconDot, { backgroundColor: item.type === 'veg' ? 'green' : 'red' }]} />
            </View>
            
            <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.itemPrice, { color: colors.text }]}>₹{item.price}</Text>
            
            <View style={styles.ratingBox}>
                <Ionicons name="star" size={10} color="#F5A623" />
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={{color: '#888', fontSize: 10}}> (150+ ratings)</Text>
            </View>
            <Text style={styles.desc} numberOfLines={2}>Rich, creamy curry cooked with special spices and butter.</Text>
        </View>

        <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <TouchableOpacity 
                style={[styles.addBtn, { backgroundColor: colors.card, borderColor: isDarkMode ? '#444' : '#ddd' }]}
                onPress={() => addToCart(item)}
            >
                <Text style={styles.addText}>ADD +</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 🟢 HEADER IMAGE */}
      <View style={styles.headerContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
          <View style={styles.headerOverlay} />
          
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
              <Text style={styles.resName}>{restaurant.name}</Text>
              <Text style={styles.resMeta}>{restaurant.category} • {restaurant.address}</Text>
              <View style={styles.resStats}>
                  <View style={styles.statBadge}><Text style={styles.statText}>⭐ 4.5</Text></View>
                  <Text style={{color: '#fff', marginLeft: 10}}>35 mins • ₹150 for one</Text>
              </View>
          </View>
      </View>

      {/* 🟢 MENU SECTION */}
      <View style={[styles.menuContainer, { backgroundColor: colors.background }]}>
          
          {/* Veg Filter Switch */}
          <View style={styles.filterRow}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Recommended ({filteredMenu.length})</Text>
              <View style={styles.switchContainer}>
                  <Text style={[styles.switchLabel, { color: isVeg ? 'green' : '#888' }]}>VEG ONLY</Text>
                  <Switch 
                    value={isVeg} 
                    onValueChange={setIsVeg}
                    trackColor={{ false: "#767577", true: "#bbf7d0" }}
                    thumbColor={isVeg ? "green" : "#f4f3f4"}
                  />
              </View>
          </View>

          <FlatList
            data={filteredMenu}
            keyExtractor={item => item.id}
            renderItem={renderMenuItem}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
      </View>

      {/* 🟢 FLOATING CART BAR (Only shows if items in cart) */}
      {cartCount > 0 && (
          <TouchableOpacity 
            style={styles.floatingCart}
            onPress={() => navigation.navigate('Cart')}
          >
              <View>
                  <Text style={styles.cartItemsText}>{cartCount} ITEMS | ₹{cartTotal}</Text>
                  <Text style={styles.cartSubText}>Extra charges may apply</Text>
              </View>
              <View style={styles.viewCartBtn}>
                  <Text style={styles.viewCartText}>View Cart</Text>
                  <Ionicons name="cart" size={18} color="#fff" style={{marginLeft: 5}} />
              </View>
          </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Header
  headerContainer: { height: 250, width: '100%', position: 'relative' },
  headerImage: { width: '100%', height: '100%' },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  backBtn: { position: 'absolute', top: 40, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
  
  headerInfo: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  resName: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  resMeta: { color: '#ddd', fontSize: 14, marginBottom: 8 },
  resStats: { flexDirection: 'row', alignItems: 'center' },
  statBadge: { backgroundColor: 'green', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  // Menu
  menuContainer: { flex: 1, borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: -20, paddingHorizontal: 20, paddingTop: 25 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  filterTitle: { fontSize: 18, fontWeight: 'bold' },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { fontSize: 12, fontWeight: 'bold', marginRight: 5 },

  // Menu Item
  menuItem: { flexDirection: 'row', paddingVertical: 20, borderBottomWidth: 1, justifyContent: 'space-between' },
  vegIconBorder: { width: 14, height: 14, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  vegIconDot: { width: 8, height: 8, borderRadius: 4 },
  itemName: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  itemPrice: { fontSize: 14, marginBottom: 5 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  ratingText: { color: '#F5A623', fontSize: 10, marginLeft: 2, fontWeight: 'bold' },
  desc: { color: '#888', fontSize: 12 },

  imageContainer: { alignItems: 'center', position: 'relative' },
  itemImage: { width: 110, height: 100, borderRadius: 12 },
  addBtn: { position: 'absolute', bottom: -10, paddingVertical: 8, paddingHorizontal: 25, borderRadius: 8, elevation: 3, borderWidth: 1 },
  addText: { color: 'green', fontWeight: 'bold', fontSize: 14 },

  // Floating Cart
  floatingCart: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#60b246', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 10 },
  cartItemsText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  cartSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 10 },
  viewCartBtn: { flexDirection: 'row', alignItems: 'center' },
  viewCartText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});