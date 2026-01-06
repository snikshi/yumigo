import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps'; // Ensure you have react-native-maps installed
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

export default function TrackOrderScreen() {
    const navigation = useNavigation();
    const { currentOrder } = useOrder();
    const { user } = useAuth();

    // Simulation State
    const [status, setStatus] = useState('Preparing');
    const [driverLoc, setDriverLoc] = useState({ latitude: 17.3850, longitude: 78.4867 });
    const [showReward, setShowReward] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(0);

    // 🟢 SIMULATE DRIVER MOVEMENT & STATUS UPDATES
    useEffect(() => {
        if (!currentOrder) return;

        const timer1 = setTimeout(() => setStatus('On the way'), 3000);
        
        // Simulate Movement
        const interval = setInterval(() => {
            setDriverLoc(prev => ({
                latitude: prev.latitude + 0.001,
                longitude: prev.longitude + 0.001
            }));
        }, 2000);

        const timer2 = setTimeout(() => {
            handleDeliveryCompletion();
        }, 8000); // Deliver after 8 seconds for demo

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearInterval(interval);
        };
    }, []);

    // 🟢 CALL BACKEND TO CONFIRM DELIVERY & GET TOKENS
    const handleDeliveryCompletion = async () => {
        setStatus('Delivered');
        try {
            // Replace with your render URL
            const res = await fetch('https://yumigo-api.onrender.com/api/orders/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: currentOrder?._id, status: 'Delivered' })
            });
            const data = await res.json();
            
            if (data.rewardEarned) {
                setRewardAmount(data.rewardEarned);
                setShowReward(true);
            }
        } catch (e) {
            console.error("Reward Error", e);
        }
    };

    return (
        <View style={styles.container}>
            
            {/* MAP VIEW */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 17.3850,
                        longitude: 78.4867,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    <Marker coordinate={driverLoc}>
                        <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png'}} style={{width:40, height:40}} />
                    </Marker>
                </MapView>
                
                {/* BACK BUTTON */}
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
                     <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* STATUS CARD */}
            <View style={styles.infoCard}>
                <View style={styles.handle} />
                <Text style={styles.timeText}>Arriving in 15 mins</Text>
                
                <View style={styles.statusRow}>
                    <View style={styles.step}>
                        <Ionicons name="restaurant" size={20} color={status === 'Preparing' ? 'orange' : '#ccc'} />
                    </View>
                    <View style={styles.line} />
                    <View style={styles.step}>
                        <Ionicons name="bicycle" size={20} color={status === 'On the way' ? 'orange' : '#ccc'} />
                    </View>
                    <View style={styles.line} />
                    <View style={styles.step}>
                        <Ionicons name="checkmark-circle" size={20} color={status === 'Delivered' ? 'green' : '#ccc'} />
                    </View>
                </View>
                <Text style={styles.statusText}>{status}</Text>

                {/* DRIVER INFO */}
                <View style={styles.driverRow}>
                    <Image source={{uri: 'https://randomuser.me/api/portraits/men/32.jpg'}} style={styles.driverPic} />
                    <View style={{marginLeft: 10, flex: 1}}>
                        <Text style={styles.driverName}>Ramesh Kumar</Text>
                        <Text style={styles.driverRating}>⭐ 4.8 • Vaccinated</Text>
                    </View>
                    <TouchableOpacity style={styles.callBtn}>
                        <Ionicons name="call" size={20} color="green" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* 🎁 REWARD POPUP MODAL */}
            <Modal visible={showReward} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.rewardCard}>
                        <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/6198/6198527.png'}} style={{width: 80, height: 80, marginBottom: 10}} />
                        <Text style={styles.rewardTitle}>Order Delivered!</Text>
                        <Text style={styles.rewardSub}>You earned crypto rewards</Text>
                        
                        <View style={styles.tokenBadge}>
                            <Text style={styles.tokenText}>+{rewardAmount} YUMI</Text>
                        </View>

                        <TouchableOpacity style={styles.claimBtn} onPress={() => { setShowReward(false); navigation.navigate('Home'); }}>
                            <Text style={styles.claimText}>CLAIM REWARD</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    mapContainer: { flex: 0.6 },
    map: { width: '100%', height: '100%' },
    backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: '#fff', padding: 10, borderRadius: 20, elevation: 5 },
    
    infoCard: { flex: 0.4, backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, elevation: 20, marginTop: -20 },
    handle: { width: 40, height: 4, backgroundColor: '#ccc', alignSelf: 'center', borderRadius: 2, marginBottom: 20 },
    timeText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    
    statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    step: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f2f2f2', alignItems: 'center', justifyContent: 'center' },
    line: { width: 50, height: 2, backgroundColor: '#f2f2f2' },
    statusText: { textAlign: 'center', color: '#888', marginBottom: 20 },

    driverRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 20 },
    driverPic: { width: 50, height: 50, borderRadius: 25 },
    driverName: { fontWeight: 'bold', fontSize: 16 },
    driverRating: { color: '#666', fontSize: 12 },
    callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e8f5e9', alignItems: 'center', justifyContent: 'center' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    rewardCard: { width: '80%', backgroundColor: '#fff', borderRadius: 20, padding: 30, alignItems: 'center', elevation: 10 },
    rewardTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    rewardSub: { color: '#888', marginBottom: 20 },
    tokenBadge: { backgroundColor: '#FFF8E1', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#FFD54F', marginBottom: 20 },
    tokenText: { fontSize: 24, fontWeight: 'bold', color: '#B8860B' },
    claimBtn: { backgroundColor: '#FF9900', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
    claimText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 }
});