import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur'; // npm install expo-blur
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const RideFoodPrompt = ({ rideEta, onOrderPress }) => {
  // Only show if ride is long enough (> 20 mins)
  if (!rideEta || rideEta < 20) return null; 

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.glassCard}>
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Ionicons name="fast-food" size={24} color="#FFD700" />
            <Text style={styles.title}> Dinner at home?</Text>
          </View>
          <Text style={styles.subtitle}>
            You reach home in {rideEta} mins. Order now to sync food arrival.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onOrderPress}>
          <Text style={styles.buttonText}>Order & Sync</Text>
          <Ionicons name="arrow-forward" size={16} color="#000" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // Just above the driver info sheet
    alignSelf: 'center',
    width: width * 0.9,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  glassCard: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    color: '#ddd',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#FFD700', // Gold color for food
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    marginRight: 5,
  },
});

export default RideFoodPrompt;