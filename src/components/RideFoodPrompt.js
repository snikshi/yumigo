import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const RideFoodPrompt = ({ rideEta, onOrderPress }) => {
  return (
    <View style={styles.container}>
      {/* 1. Left Side: Text Info */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Hungry?</Text>
          <Text style={styles.subtitle}> Dinner at home?</Text>
        </View>
        <Text style={styles.desc}>
          You reach in <Text style={{fontWeight: 'bold'}}>{rideEta} mins</Text>. 
          Order now & food arrives with you! 🚀
        </Text>
      </View>

      {/* 2. Right Side: Button */}
      <TouchableOpacity style={styles.btn} onPress={onOrderPress}>
        <Text style={styles.btnText}>Order Now</Text>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </TouchableOpacity>

      {/* 3. Floating Image (Pizza) */}
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png' }} 
        style={styles.floatingImage} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // 👈 Critical for floating over map
    bottom: 90,           // 👈 Adjust this if it's too low/high
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,        // 👈 Shadow for Android
    shadowColor: '#000',  // 👈 Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,          // 👈 Force it on top of everything
  },
  content: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666' },
  desc: { fontSize: 12, color: '#888', maxWidth: '90%' },
  btn: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12, marginRight: 5 },
  floatingImage: { position: 'absolute', top: -20, right: 10, width: 40, height: 40, resizeMode: 'contain' }
});

export default RideFoodPrompt;