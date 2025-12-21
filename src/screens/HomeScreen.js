import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  ActivityIndicator, TouchableOpacity, TextInput, SafeAreaView, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 👈 Built-in Icons!
import { useCart } from '../context/CartContext';
import { formatPrice } from '../helpers/currency';

export default function HomeScreen() {
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

  // 👇 The "Hero" Banner Component
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* 1. Greeting & Location */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.greeting}>Good Afternoon, Boss! 👋</Text>
          <View style={styles.locationPill}>
            <Ionicons name="location" size={16} color="#FF9900" />
            <Text style={styles.locationText}> Hyderabad, India</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </View>
        </View>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
          style={styles.profilePic} 
        />
      </View>

      {/* 2. Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput placeholder="Craving Biryani?" style={styles.searchInput} />
      </View>

      {/* 3. Promo Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.promoTextContainer}>
          <Text style={styles.promoTitle}>50% OFF</Text>
          <Text style={styles.promoSubtitle}>On your first order</Text>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Claim Now</Text>
          </TouchableOpacity>
        </View>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/706/706164.png' }} 
          style={styles.promoImage} 
        />
      </View>

      <Text style={styles.sectionTitle}>Recommended for you 🔥</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9900" />
          <Text style={styles.loadingText}>Finding best food...</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader} // 👈 Adds our new header
          data={foods}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <View style={styles.textRow}>
                    <Text style={styles.title}>{item.name}</Text>
                    <View style={styles.ratingPill}>
                        <Text style={styles.ratingText}>4.5 ⭐</Text>
                    </View>
                </View>
                <Text style={styles.description} numberOfLines={2}>
                  Delicious {item.name} prepared with secret spices and love.
                </Text>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                        <Text style={styles.addText}>ADD +</Text>
                    </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// ✨ PRO STYLES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#888' },
  listContent: { paddingBottom: 20 },
  
  // Header Styles
  headerContainer: { padding: 20, backgroundColor: '#fff', marginBottom: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 14, color: '#888', fontWeight: '600' },
  locationPill: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  profilePic: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#eee' },
  
  // Search
  searchBar: { flexDirection: 'row', backgroundColor: '#F0F0F0', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },

  // Banner
  promoBanner: { backgroundColor: '#FF9900', borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, elevation: 5, shadowColor: '#FF9900', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  promoTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  promoSubtitle: { color: 'rgba(255,255,255,0.9)', marginBottom: 10, fontSize: 14 },
  promoButton: { backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'flex-start' },
  promoButtonText: { color: '#FF9900', fontWeight: 'bold', fontSize: 12 },
  promoImage: { width: 80, height: 80 },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 5 },

  // Card Styles
  card: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 15, borderRadius: 16, padding: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  image: { width: 90, height: 90, borderRadius: 12, marginRight: 15 },
  info: { flex: 1, justifyContent: 'space-between' },
  textRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  ratingPill: { backgroundColor: '#E8F5E9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  ratingText: { color: '#2E7D32', fontSize: 10, fontWeight: 'bold' },
  description: { fontSize: 12, color: '#888', marginTop: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { fontSize: 18, fontWeight: '900', color: '#333' },
  addButton: { backgroundColor: '#FFF0E0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#FF9900' },
  addText: { color: '#FF9900', fontWeight: 'bold', fontSize: 12 }
});