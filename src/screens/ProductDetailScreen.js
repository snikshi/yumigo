import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, 
  StatusBar, Alert, ActivityIndicator, FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext'; 

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params; 
  const { addToCart } = useCart();
  const [buying, setBuying] = useState(false);

  // Calculate Discount
  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  // Fake Reviews Generator
  const reviews = [
    { id: '1', user: 'Rahul K.', rating: 5, text: 'Absolutely love this! Worth every penny.' },
    { id: '2', user: 'Sneha P.', rating: 4, text: 'Great quality, but delivery took 2 days.' },
    { id: '3', user: 'Vikram S.', rating: 5, text: 'Best purchase I made this year. Highly recommend!' },
  ];

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert("Added to Cart", `${product.name} is in your cart! 🛒`);
  };

  // 🪄 Buy Now Animation Logic
  const handleBuyNow = () => {
    setBuying(true); 
    
    setTimeout(() => {
        addToCart(product);
        setBuying(false);


        // ✅ NEW: Go to Tabs -> Cart
        navigation.navigate('MainTabs', { screen: 'Cart' });
    }, 1500);
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.user.charAt(0)}</Text>
            </View>
            <View>
                <Text style={styles.reviewerName}>{item.user}</Text>
                <Text style={styles.starText}>{'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}</Text>
            </View>
        </View>
        <Text style={styles.reviewText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}>
    <Ionicons name="cart-outline" size={24} color="#000" />
</TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PRODUCT IMAGE */}
        <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
            <TouchableOpacity style={styles.shareBtn} onPress={() => Alert.alert("Share", "Link copied!")}>
                <Ionicons name="share-social" size={20} color="#666" />
            </TouchableOpacity>
        </View>

        {/* INFO SECTION */}
        <View style={styles.infoContainer}>
            <Text style={styles.category}>{product.category || 'General'}</Text>
            <Text style={styles.name}>{product.name}</Text>
            
            {/* Price Block */}
            <View style={styles.priceRow}>
                <Text style={styles.price}>₹{product.price}</Text>
                {product.oldPrice && <Text style={styles.oldPrice}>₹{product.oldPrice}</Text>}
                {discount > 0 && <View style={styles.discountBadge}><Text style={styles.discountText}>{discount}% OFF</Text></View>}
            </View>

            {/* Delivery Info */}
            <View style={styles.deliveryBox}>
                <Ionicons name="rocket-outline" size={20} color="#007AFF" />
                <Text style={{marginLeft: 10, color: '#333'}}>
                    Fast Delivery by <Text style={{fontWeight: 'bold'}}>Tomorrow, 9 PM</Text>
                </Text>
            </View>

            {/* Description */}
            <Text style={styles.sectionTitle}>About this item</Text>
            <Text style={styles.description}>
                {product.description || "This premium product features top-tier materials, durability, and a sleek design. It comes with a 1-year manufacturing warranty."}
            </Text>

            {/* REVIEWS SECTION */}
            <Text style={styles.sectionTitle}>Customer Reviews ({reviews.length})</Text>
            {reviews.map(review => (
                <View key={review.id} style={{marginBottom: 10}}>
                    {renderReview({ item: review })}
                </View>
            ))}
        </View>
      </ScrollView>

      {/* BOTTOM ACTION BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
            <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
            style={[styles.buyBtn, buying && {backgroundColor: '#e6ac00'}]} 
            onPress={handleBuyNow}
            disabled={buying}
        >
            {buying ? (
                <ActivityIndicator color="#000" />
            ) : (
                <Text style={styles.buyText}>Buy Now</Text>
            )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, paddingTop: 40, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: 20 },
  
  imageContainer: { width: '100%', height: 350, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  image: { width: '85%', height: '85%' },
  shareBtn: { position: 'absolute', bottom: 20, right: 20, padding: 10, backgroundColor: '#fff', borderRadius: 30, elevation: 3 },

  infoContainer: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, shadowColor: '#000', elevation: 10 },
  category: { color: '#888', fontSize: 12, textTransform: 'uppercase', marginBottom: 5, letterSpacing: 1 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  price: { fontSize: 30, fontWeight: 'bold', color: '#000' },
  oldPrice: { fontSize: 18, color: '#999', textDecorationLine: 'line-through', marginLeft: 10 },
  discountBadge: { backgroundColor: '#e6f4ea', marginLeft: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  discountText: { color: 'green', fontWeight: 'bold', fontSize: 12 },

  deliveryBox: { flexDirection: 'row', backgroundColor: '#eef6ff', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  description: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 20 },

  // Reviews
  reviewCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { fontWeight: 'bold', color: '#555' },
  reviewerName: { fontWeight: 'bold', fontSize: 14 },
  starText: { color: '#f0c14b', fontSize: 12 },
  reviewText: { color: '#444', fontSize: 13 },

  bottomBar: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff', paddingBottom: 30 },
  cartBtn: { flex: 1, backgroundColor: '#ffecd2', padding: 15, borderRadius: 10, alignItems: 'center', marginRight: 10 },
  cartText: { color: '#d97706', fontWeight: 'bold', fontSize: 16 },
  buyBtn: { flex: 1, backgroundColor: '#fbbf24', padding: 15, borderRadius: 10, alignItems: 'center' },
  buyText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});