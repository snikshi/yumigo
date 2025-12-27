import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function CouponsScreen({ navigation }) {
  const [manualCode, setManualCode] = useState('');

  // Mock Coupons Data
  const coupons = [
    {
      id: '1',
      code: 'TRYNEW',
      title: 'Get 60% OFF',
      description: 'Use code TRYNEW & get 60% off on orders above ₹159. Maximum discount: ₹120.',
      discountAmount: 120,
      minOrder: 159
    },
    {
      id: '2',
      code: 'ZOMATO',
      title: 'Flat ₹100 OFF',
      description: 'Flat ₹100 off on orders above ₹249.',
      discountAmount: 100,
      minOrder: 249
    },
    {
      id: '3',
      code: 'FREEDEL',
      title: 'Free Delivery',
      description: 'Get free delivery on your order.',
      discountAmount: 56, // Assuming 56 is delivery fee
      type: 'DELIVERY'
    },
    {
      id: '4',
      code: 'MASTER',
      title: '15% Cashback',
      description: 'Pay using Mastercard and get 15% cashback upto ₹50.',
      discountAmount: 50,
      minOrder: 100
    }
  ];

  const handleApply = (coupon) => {
    // 1. (Optional) Validation logic here if you had access to cart total
    
    // 2. Navigate back to Cart with the selected coupon object
    navigation.navigate({
      name: 'Cart',
      params: { appliedCoupon: coupon },
      merge: true, // Merges params into existing CartScreen params
    });
  };

  const handleManualApply = () => {
    if (!manualCode) {
      Alert.alert("Error", "Please enter a coupon code");
      return;
    }
    // Simple mock check
    const found = coupons.find(c => c.code === manualCode.toUpperCase());
    if (found) {
      handleApply(found);
    } else {
      Alert.alert("Invalid Code", "This coupon code is not valid.");
    }
  };

  const renderCoupon = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.logoBox}>
            <MaterialCommunityIcons name="ticket-percent" size={24} color="#e23744" />
        </View>
        <View style={{flex: 1, paddingRight: 10}}>
            <Text style={styles.codeText}>{item.code}</Text>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.descText}>{item.description}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleApply(item)}>
        <Text style={styles.applyBtnText}>APPLY</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply Coupon</Text>
      </View>

      {/* Manual Input */}
      <View style={styles.inputContainer}>
        <TextInput 
            style={styles.input} 
            placeholder="Enter coupon code" 
            value={manualCode}
            onChangeText={setManualCode}
            autoCapitalize="characters"
        />
        <TouchableOpacity onPress={handleManualApply}>
            <Text style={styles.applyInputText}>APPLY</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Available Coupons</Text>

      {/* List */}
      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        renderItem={renderCoupon}
        contentContainerStyle={{ padding: 15 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    paddingTop: 40 // Adjust for status bar
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed'
  },
  input: { flex: 1, fontSize: 16, textTransform: 'uppercase' },
  applyInputText: { color: '#e23744', fontWeight: 'bold', letterSpacing: 1 },

  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginLeft: 15, marginBottom: 5 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2
  },
  cardLeft: { flexDirection: 'row', flex: 1 },
  logoBox: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: '#fff0f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  codeText: { fontWeight: 'bold', fontSize: 14, color: '#333', marginBottom: 2 },
  titleText: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  descText: { fontSize: 11, color: '#888', lineHeight: 16 },
  
  applyBtnText: { color: '#e23744', fontWeight: 'bold', fontSize: 14 }
});