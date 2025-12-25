import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps'; // 👈 IMPORT MAP
import { useOrder } from '../context/OrderContext'; 

export default function TrackOrderScreen({ navigation }) {
  const { liveOrder } = useOrder();

  if (!liveOrder) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No active order found 🧐</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.homeBtn}>
            <Text style={styles.homeText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isHeld = liveOrder.status === 'Scheduled';
  
  // Status Steps Logic
  let currentStep = 0;
  if (isHeld) currentStep = 0;
  if (liveOrder.status === 'Preparing') currentStep = 1;
  if (liveOrder.status === 'Out for Delivery') currentStep = 2;
  if (liveOrder.status === 'Delivered') currentStep = 3;

  const steps = [
    { title: "Order Placed", icon: "receipt-outline" },
    { title: "Preparing", icon: "fast-food-outline" },
    { title: "Out for Delivery", icon: "bicycle-outline" },
    { title: "Delivered", icon: "home-outline" }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
          <Ionicons name="close" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{liveOrder._id ? liveOrder._id.slice(-6) : '...'}</Text>
        <View style={{ width: 30 }} /> 
      </View>

      {isHeld && (
        <View style={styles.holdBanner}>
            <Ionicons name="time" size={24} color="#fff" />
            <Text style={styles.holdText}>Ride is long 🚖. Holding order so it arrives fresh!</Text>
        </View>
      )}

      {/* 👇 REAL MAP VIEW */}
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
            {/* Restaurant Marker */}
            <Marker coordinate={{ latitude: 17.3850, longitude: 78.4867 }} title="Restaurant">
                 <View style={{backgroundColor: 'white', padding: 5, borderRadius: 20}}>
                    <Text>🍕</Text>
                 </View>
            </Marker>

            {/* Home Marker */}
            <Marker coordinate={{ latitude: 17.4200, longitude: 78.5000 }} title="Home" pinColor="blue" />

            {/* Delivery Boy (Only show if Out for Delivery) */}
            {!isHeld && (
                <Marker coordinate={{ latitude: 17.4000, longitude: 78.4900 }} title="Delivery Partner">
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png' }} style={{width: 35, height: 35}} />
                </Marker>
            )}
        </MapView>

        <View style={[styles.statusBadge, isHeld && { backgroundColor: '#444' }]}>
            <Text style={styles.statusText}>{liveOrder.status.toUpperCase()}</Text>
        </View>
      </View>

      {/* STEPS LIST (Same as before) */}
      <View style={styles.statusContainer}>
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          return (
            <View key={index} style={styles.stepRow}>
              <View style={styles.iconContainer}>
                <View style={[styles.circle, isActive ? styles.activeCircle : styles.inactiveCircle]}>
                    <Ionicons name={step.icon} size={18} color={isActive ? "#fff" : "#888"} />
                </View>
                {index < 3 && <View style={[styles.line, isActive ? styles.activeLine : styles.inactiveLine]} />}
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.stepTitle, isActive && styles.activeText]}>{step.title}</Text>
                {index === 0 && isHeld && <Text style={{color: 'orange', fontSize: 12}}>Waiting for sync...</Text>}
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  
  holdBanner: { backgroundColor: '#FF9900', padding: 15, flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 10, marginBottom: 10 },
  holdText: { color: '#fff', fontWeight: 'bold', marginLeft: 10, flex: 1 },

  // Updated Map Styles
  mapContainer: { height: 250, width: '100%', position: 'relative' },
  map: { width: '100%', height: '100%' },

  statusBadge: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: 'green', padding: 10, borderRadius: 10 },
  statusText: { color: '#fff', fontWeight: 'bold' },
  
  statusContainer: { flex: 1, padding: 30 },
  stepRow: { flexDirection: 'row', height: 70 },
  iconContainer: { alignItems: 'center', marginRight: 15 },
  circle: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  activeCircle: { backgroundColor: 'green' },
  inactiveCircle: { backgroundColor: '#eee' },
  line: { width: 2, flex: 1, backgroundColor: '#eee', position: 'absolute', top: 34, zIndex: 1 },
  activeLine: { backgroundColor: 'green' },
  inactiveLine: { backgroundColor: '#eee' },
  textContainer: { justifyContent: 'flex-start', paddingTop: 5 },
  stepTitle: { fontSize: 16, color: '#888' },
  activeText: { color: '#000', fontWeight: 'bold' },
  errorText: { fontSize: 18, marginBottom: 20 },
  homeBtn: { backgroundColor: '#333', padding: 10, borderRadius: 8 },
  homeText: { color: '#fff' }
});