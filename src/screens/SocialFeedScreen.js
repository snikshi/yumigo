import React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const { height, width } = Dimensions.get('window');

// Mock Data
const FEED_ITEMS = [
    { 
        id: '1', 
        user: 'FoodieKing', 
        desc: 'This Burger is insane! 🍔🔥 #Yumigo', 
        product: { _id: 'b1', name: 'Jumbo Burger', price: 199, image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
        color: '#1a1a1a' // Background placeholder
    },
    { 
        id: '2', 
        user: 'SarahEats', 
        desc: 'Late night craving sorted. 🍕', 
        product: { _id: 'p1', name: 'Pepperoni Pizza', price: 299, image: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png' },
        color: '#2c3e50'
    },
];

export default function SocialFeedScreen() {
    const { addToCart } = useCart();

    const renderItem = ({ item }) => (
        <View style={[styles.page, { backgroundColor: item.color }]}>
            {/* Overlay UI */}
            <View style={styles.overlay}>
                {/* Right Side Actions */}
                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="heart" size={35} color="white" />
                        <Text style={styles.actionText}>2.5k</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="chatbubble-ellipses" size={35} color="white" />
                        <Text style={styles.actionText}>340</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="share-social" size={35} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Bottom Info & Product */}
                <View style={styles.bottomContainer}>
                    <Text style={styles.username}>@{item.user}</Text>
                    <Text style={styles.desc}>{item.desc}</Text>

                    {/* Shoppable Card */}
                    <View style={styles.productCard}>
                        <Image source={{ uri: item.product.image }} style={styles.productImg} />
                        <View style={{flex: 1, marginLeft: 10}}>
                            <Text style={styles.prodName}>{item.product.name}</Text>
                            <Text style={styles.prodPrice}>₹{item.product.price}</Text>
                        </View>
                        <TouchableOpacity style={styles.buyBtn} onPress={() => addToCart(item.product)}>
                            <Text style={styles.buyText}>ORDER</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <FlatList
            data={FEED_ITEMS}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={height - 75} // Adjust for TabBar height
            decelerationRate="fast"
        />
    );
}

const styles = StyleSheet.create({
    page: { width: width, height: height - 75, justifyContent: 'center', alignItems: 'center' },
    overlay: { position: 'absolute', bottom: 20, left: 20, right: 20, zIndex: 10 },
    rightActions: { position: 'absolute', right: 0, bottom: 180, alignItems: 'center' },
    actionBtn: { marginBottom: 20, alignItems: 'center' },
    actionText: { color: '#fff', fontWeight: 'bold', marginTop: 5 },
    
    bottomContainer: { width: '85%' },
    username: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
    desc: { color: '#eee', fontSize: 14, marginBottom: 15 },
    
    productCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.9)', padding: 10, borderRadius: 12, alignItems: 'center' },
    productImg: { width: 40, height: 40, borderRadius: 8 },
    prodName: { fontWeight: 'bold', color: '#000' },
    prodPrice: { color: 'green', fontWeight: 'bold' },
    buyBtn: { backgroundColor: '#FF4B3A', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
    buyText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});