import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrder } from '../context/OrderContext'; // 👈 Listen to Context

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

  // 👇 Calculate Step based on Status text
  let currentStep = 0;
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
        <Text style={styles.headerTitle}>Order #{liveOrder.id}</Text>
        <View style={{ width: 30 }} /> 
      </View>

      <View style={styles.mapContainer}>
        <Image source={{ uri: 'https://i.imgur.com/8J5f8lq.png' }} style={styles.mapImage} />
        <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{liveOrder.status.toUpperCase()}</Text>
        </View>
      </View>

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
  mapContainer: { height: 250, width: '100%', backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  mapImage: { width: '100%', height: '100%', opacity: 0.8 },
  statusBadge: { position: 'absolute', bottom: 20, backgroundColor: '#FF9900', padding: 10, borderRadius: 10 },
  statusText: { color: '#fff', fontWeight: 'bold' },
  statusContainer: { flex: 1, padding: 30 },
  stepRow: { flexDirection: 'row', height: 70 },
  iconContainer: { alignItems: 'center', marginRight: 15 },
  circle: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  activeCircle: { backgroundColor: '#FF9900' },
  inactiveCircle: { backgroundColor: '#eee' },
  line: { width: 2, flex: 1, backgroundColor: '#eee', position: 'absolute', top: 34, zIndex: 1 },
  activeLine: { backgroundColor: '#FF9900' },
  inactiveLine: { backgroundColor: '#eee' },
  textContainer: { justifyContent: 'flex-start', paddingTop: 5 },
  stepTitle: { fontSize: 16, color: '#888' },
  activeText: { color: '#000', fontWeight: 'bold' },
  errorText: { fontSize: 18, marginBottom: 20 },
  homeBtn: { backgroundColor: '#333', padding: 10, borderRadius: 8 },
  homeText: { color: '#fff' }
});