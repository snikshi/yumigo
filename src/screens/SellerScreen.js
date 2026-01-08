import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, 
    TextInput, ActivityIndicator, Alert, Modal, FlatList, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function SellerScreen() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Add Item State
    const [modalVisible, setModalVisible] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Fast Food', image: '' });

    // 🟢 FETCH DASHBOARD DATA
    const fetchDashboard = async () => {
        try {
            // Replace with your Render URL
            const res = await fetch(`https://yumigo-api.onrender.com/api/partner/stats/${user?.id || 'admin'}`);
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
                setOrders(data.recentOrders);
            }
        } catch (e) {
            console.error("Dashboard Error", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
        const interval = setInterval(fetchDashboard, 10000); // Auto-refresh every 10s
        return () => clearInterval(interval);
    }, []);

    // 🟢 ADD ITEM HANDLER
    const handleAddItem = async () => {
        if (!newItem.name || !newItem.price) return Alert.alert("Error", "Please fill required fields");
        
        try {
            setLoading(true);
            const res = await fetch('https://yumigo-api.onrender.com/api/partner/add-item', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newItem, sellerId: user?.id })
            });
            const data = await res.json();
            
            if (data.success) {
                Alert.alert("Success", "Item added to Menu! 🍔");
                setModalVisible(false);
                setNewItem({ name: '', price: '', category: 'Fast Food', image: '' });
            } else {
                Alert.alert("Error", "Failed to add item");
            }
        } catch (e) {
            Alert.alert("Network Error", "Check connection");
        } finally {
            setLoading(false);
        }
    };

    // 🟢 UPDATE ORDER STATUS
    const updateOrderStatus = async (orderId, status) => {
        try {
            await fetch('https://yumigo-api.onrender.com/api/partner/update-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status })
            });
            fetchDashboard(); // Refresh UI
        } catch (e) {
            console.error("Update Error", e);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
            
            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Seller Dashboard</Text>
                    <Text style={styles.headerSub}>Welcome back, {user?.name || 'Partner'}</Text>
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                    <Ionicons name="add" size={24} color="#fff" />
                    <Text style={{color:'#fff', fontWeight:'bold', marginLeft:5}}>ADD ITEM</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                
                {/* 1. STATS CARDS */}
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, {backgroundColor: '#E3F2FD'}]}>
                        <Text style={styles.statLabel}>Revenue</Text>
                        <Text style={[styles.statValue, {color: '#1565C0'}]}>
                            ₹{stats?.revenue?.toLocaleString() || '0'}
                        </Text>
                    </View>
                    <View style={[styles.statCard, {backgroundColor: '#E8F5E9'}]}>
                        <Text style={styles.statLabel}>Orders</Text>
                        <Text style={[styles.statValue, {color: '#2E7D32'}]}>
                            {stats?.totalOrders || '0'}
                        </Text>
                    </View>
                    <View style={[styles.statCard, {backgroundColor: '#FFF3E0'}]}>
                        <Text style={styles.statLabel}>Pending</Text>
                        <Text style={[styles.statValue, {color: '#EF6C00'}]}>
                            {stats?.pending || '0'}
                        </Text>
                    </View>
                </View>

                {/* 2. LIVE ORDERS */}
                <Text style={styles.sectionTitle}>Live Orders</Text>
                {loading ? <ActivityIndicator size="large" color="#000" /> : (
                    orders.map((order) => (
                        <View key={order._id} style={styles.orderCard}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                                <Text style={styles.orderId}>#{order._id.slice(-6)}</Text>
                                <View style={[styles.statusBadge, { 
                                    backgroundColor: order.status === 'Delivered' ? '#E8F5E9' : '#FFF3E0' 
                                }]}>
                                    <Text style={{
                                        color: order.status === 'Delivered' ? 'green' : 'orange', 
                                        fontWeight: 'bold', fontSize: 10
                                    }}>{order.status}</Text>
                                </View>
                            </View>
                            
                            <Text style={styles.orderItems}>
                                {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                            </Text>
                            <Text style={styles.orderPrice}>Total: ₹{order.totalPrice}</Text>

                            {/* Action Buttons */}
                            {order.status === 'Placed' && (
                                <View style={styles.actionRow}>
                                    <TouchableOpacity 
                                        style={[styles.actionBtn, {backgroundColor: '#FFEBEE'}]}
                                        onPress={() => updateOrderStatus(order._id, 'Cancelled')}
                                    >
                                        <Text style={{color: 'red', fontWeight: 'bold'}}>Reject</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.actionBtn, {backgroundColor: '#E8F5E9'}]}
                                        onPress={() => updateOrderStatus(order._id, 'Preparing')}
                                    >
                                        <Text style={{color: 'green', fontWeight: 'bold'}}>Accept</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                             {order.status === 'Preparing' && (
                                <TouchableOpacity 
                                    style={[styles.fullWidthBtn, {backgroundColor: '#E3F2FD'}]}
                                    onPress={() => updateOrderStatus(order._id, 'Delivered')}
                                >
                                    <Text style={{color: '#1565C0', fontWeight: 'bold'}}>Mark Delivered 🚴</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>

            {/* ADD ITEM MODAL */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Item</Text>
                        
                        <TextInput 
                            placeholder="Item Name (e.g. Cheese Burger)" 
                            style={styles.input}
                            value={newItem.name}
                            onChangeText={t => setNewItem({...newItem, name: t})} 
                        />
                        <TextInput 
                            placeholder="Price (e.g. 150)" 
                            keyboardType="numeric"
                            style={styles.input}
                            value={newItem.price}
                            onChangeText={t => setNewItem({...newItem, price: t})} 
                        />
                        <TextInput 
                            placeholder="Image URL" 
                            style={styles.input}
                            value={newItem.image}
                            onChangeText={t => setNewItem({...newItem, image: t})} 
                        />
                        <TextInput 
                            placeholder="Category (e.g. Pizza, Indian)" 
                            style={styles.input}
                            value={newItem.category}
                            onChangeText={t => setNewItem({...newItem, category: t})} 
                        />

                        <TouchableOpacity style={styles.submitBtn} onPress={handleAddItem}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{color: '#fff', fontWeight: 'bold'}}>ADD TO MENU</Text>}
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={{marginTop: 15}} onPress={() => setModalVisible(false)}>
                            <Text style={{color: 'red'}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { backgroundColor: '#1a1a1a', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    headerSub: { color: '#aaa', fontSize: 12 },
    addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF9900', padding: 8, borderRadius: 20, paddingHorizontal: 12 },
    
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
    statCard: { width: '31%', padding: 15, borderRadius: 10, alignItems: 'center', elevation: 2 },
    statLabel: { fontSize: 10, fontWeight: 'bold', color: '#666', marginBottom: 5 },
    statValue: { fontSize: 16, fontWeight: 'bold' },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', margin: 15, marginBottom: 10 },
    
    orderCard: { backgroundColor: '#fff', marginHorizontal: 15, marginBottom: 15, padding: 15, borderRadius: 12, elevation: 3 },
    orderId: { fontWeight: 'bold', color: '#333' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    orderItems: { fontSize: 14, color: '#555', marginTop: 5, lineHeight: 20 },
    orderPrice: { fontWeight: 'bold', marginTop: 5, fontSize: 16 },
    
    actionRow: { flexDirection: 'row', marginTop: 15, justifyContent: 'flex-end' },
    actionBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, marginLeft: 10 },
    fullWidthBtn: { marginTop: 15, padding: 12, borderRadius: 8, alignItems: 'center' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 10 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderBottomWidth: 1, borderColor: '#eee', marginBottom: 15, padding: 10, fontSize: 16 },
    submitBtn: { backgroundColor: '#000', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 }
});