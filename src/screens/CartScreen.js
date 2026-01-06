import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch
} from 'react-native';

import { useWallet } from '../context/WalletContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStripe } from '@stripe/stripe-react-native';
import { useOrder } from '../context/OrderContext';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const formatPrice = (price) => `₹${Number(price).toFixed(2)}`;

export default function CartScreen({ navigation, route }) {
  // --- PARAMS & CONTEXT ---
  const { syncedRideId, rideDuration } = route.params || {};
  const { cart, removeFromCart, clearCart } = useCart(); 
  const cartItems = cart || []; 
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { startOrder } = useOrder();
  const { balance, payFromWallet } = useWallet();

  // --- LOCAL STATE ---
  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState(0);
  const [donate, setDonate] = useState(true);
  const [useWallet, setUseWallet] = useState(false); 
  const [coupon, setCoupon] = useState(null); // Coupon State

  // --- 1. LISTEN FOR COUPON FROM COUPONS SCREEN ---
  useEffect(() => {
    if (route.params?.appliedCoupon) {
        setCoupon(route.params.appliedCoupon);
        // Optional: Reset params to avoid re-triggering if needed, but safe to keep
        navigation.setParams({ appliedCoupon: null });
    }
  }, [route.params?.appliedCoupon]);

  // --- CALCULATIONS ---
  const itemTotal = cartItems.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);
  
  // Constants 
  const packagingCharge = 38.10;
  const deliveryFee = 56.00;
  const deliveryDiscount = 56.00; 
  const platformFee = 12.50;
  const taxes = 10.30;
  const donationAmount = donate ? 5.00 : 0;
  
  // 2. CALCULATE DISCOUNT
  const couponDiscount = coupon ? (coupon.discountAmount || 0) : 0;

  // 3. FINAL TOTAL (Subtract Discount)
  const finalToPay = Math.max(0, itemTotal + packagingCharge + (deliveryFee - deliveryDiscount) + platformFee + taxes + donationAmount + tip - couponDiscount);
  
  // Wallet Logic
  const walletCovered = useWallet ? Math.min(balance, finalToPay) : 0;
  const remainingToPay = finalToPay - walletCovered;
  const isInsufficientWallet = useWallet && balance < finalToPay;

  // --- PAYMENT HANDLERS ---
  const handleCheckout = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to place an order.');
      return;
    }

    // Case 1: Wallet covers everything
    if (useWallet && balance >= finalToPay) {
        await processOrder('Wallet', finalToPay);
        return;
    }

    // Case 2: Split Payment (Wallet + Card) OR Just Card
    if (remainingToPay > 0) {
        await handleStripePayment();
    }
  };

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://yumigo-api.onrender.com/api/payments/intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(remainingToPay * 100) }), 
      });
      const json = await response.json();
      
      if (!json.clientSecret) {
        setLoading(false);
        Alert.alert("Error", "Server error generating payment");
        return;
      }

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Yumigo',
        paymentIntentClientSecret: json.clientSecret,
      });
      if (initError) { setLoading(false); return; }

      const { error: paymentError } = await presentPaymentSheet();
      
      if (paymentError) {
        Alert.alert("Cancelled", "Payment cancelled");
        setLoading(false);
      } else {
        if (useWallet && walletCovered > 0) {
             const walletSuccess = await payFromWallet(walletCovered); 
             if (!walletSuccess) {
                 Alert.alert("Warning", "Card charged, but Wallet deduction failed.");
             }
        }
        await processOrder('Card', finalToPay);
      }
    } catch (e) {
        console.error(e);
        setLoading(false);
    }
  };

  const processOrder = async (method, amount) => {
    setLoading(true);
    try {
        if (method === 'Wallet') {
            const success = await payFromWallet(amount);
            if (!success) { throw new Error("Wallet deduction failed"); }
        }

        const response = await fetch("https://yumigo-api.onrender.com/api/orders/create", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user._id || user.id,
              items: cartItems,
              totalPrice: amount,
              paymentMethod: method,
              rideId: syncedRideId || null, 
              rideDuration: rideDuration || null 
            })
        });
        const json = await response.json();

        if (json.success) {
            startOrder(cartItems, amount);
            clearCart();
            navigation.navigate('TrackOrder');
        } else {
            Alert.alert("Order Failed", json.message);
        }
    } catch (error) {
        Alert.alert("Error", error.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/11329/11329060.png' }} style={styles.emptyCartImage} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.subText}>Add something yummy!</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.goBackText}>Browse Restaurants</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1c1c1c" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>McDonald's</Text>
            <View style={styles.deliveryTimeTag}>
                <Text style={styles.deliveryTimeText}>20-25 mins to Home</Text>
                <Ionicons name="chevron-down" size={12} color="green" />
            </View>
        </View>
        <Ionicons name="share-outline" size={24} color="#1c1c1c" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
        
        {/* SAVINGS BANNER */}
        <View style={styles.goldBanner}>
            <Text style={styles.goldText}>
                🥳 You saved <Text style={{fontWeight:'bold'}}>₹{138 + couponDiscount}</Text>, including <Text style={{fontWeight:'bold'}}>₹56</Text> with <Text style={{fontWeight:'bold', color:'#B8860B'}}>Gold</Text>
            </Text>
        </View>

        {/* DELIVERY DETAILS */}
        <View style={styles.sectionCard}>
            <View style={styles.deliveryRow}>
                <View style={styles.iconBox}>
                    <Ionicons name="home" size={20} color="#e23744" />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.sectionHeader}>Delivery at Home</Text>
                    <Text style={styles.addressText} numberOfLines={1}>4-51-317 Maqduumnagar, Chaitanya...</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.changeText}>CHANGE</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* CART ITEMS */}
        <View style={styles.sectionCard}>
            {cartItems.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                    <View style={styles.vegIconContainer}>
                        <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={16} color="green" />
                    </View>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                    </View>
                    <View style={styles.qtyContainer}>
                         <View style={styles.qtyBox}>
                            <TouchableOpacity onPress={() => removeFromCart(item._id || item.id)}>
                                <Text style={styles.qtyBtn}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyNum}>{item.quantity || 1}</Text>
                            <TouchableOpacity>
                                <Text style={styles.qtyBtn}>+</Text>
                            </TouchableOpacity>
                         </View>
                         <Text style={styles.itemFinalPrice}>{formatPrice(item.price * (item.quantity || 1))}</Text>
                    </View>
                </View>
            ))}
        </View>

        {/* OFFERS / COUPONS */}
        <TouchableOpacity style={styles.offerCard} onPress={() => navigation.navigate('Coupons')}>
            <MaterialCommunityIcons name="ticket-percent-outline" size={24} color="#364fc7" />
            <View style={{flex: 1, marginLeft: 10}}>
                <Text style={styles.offerText}>
                    {coupon ? `Code ${coupon.code} applied!` : "View all coupons"}
                </Text>
                {coupon && <Text style={{fontSize:10, color:'green'}}>- ₹{coupon.discountAmount} saved</Text>}
            </View>
            {coupon ? (
                <TouchableOpacity onPress={() => setCoupon(null)}>
                    <Text style={{color:'red', fontSize:12, fontWeight:'bold'}}>REMOVE</Text>
                </TouchableOpacity>
            ) : (
                <Ionicons name="chevron-forward" size={16} color="#aaa" />
            )}
        </TouchableOpacity>

        {/* TIP SECTION */}
        <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>Tip your delivery partner</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipScroll}>
                {[20, 30, 50].map((amt) => (
                    <TouchableOpacity 
                        key={amt} 
                        style={[styles.tipBtn, tip === amt && styles.tipBtnActive]}
                        onPress={() => setTip(tip === amt ? 0 : amt)}
                    >
                        <Text style={styles.tipEmoji}>{amt === 20 ? '🙂' : amt === 30 ? '😊' : '💖'}</Text>
                        <Text style={[styles.tipText, tip === amt && styles.tipTextActive]}>₹{amt}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* BILL SUMMARY */}
        <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>Bill Summary</Text>
            
            <View style={styles.billRow}>
                <Text style={styles.billLabel}>Item total</Text>
                <Text style={styles.billVal}>{formatPrice(itemTotal)}</Text>
            </View>
            
            <View style={styles.billRow}>
                <Text style={styles.billLabel}>Packaging charges</Text>
                <Text style={styles.billVal}>{formatPrice(packagingCharge)}</Text>
            </View>

            <View style={styles.billRow}>
                <Text style={styles.billLabel}>Platform fee</Text>
                <Text style={styles.billVal}>{formatPrice(platformFee)}</Text>
            </View>

            {/* SHOW COUPON DISCOUNT ROW IF APPLIED */}
            {coupon && (
                <View style={styles.billRow}>
                    <Text style={[styles.billLabel, {color: 'green'}]}>Coupon Discount</Text>
                    <Text style={[styles.billVal, {color: 'green'}]}>- {formatPrice(couponDiscount)}</Text>
                </View>
            )}

            <View style={styles.billRow}>
                <Text style={styles.billLabel}>GST & Taxes</Text>
                <Text style={styles.billVal}>{formatPrice(taxes)}</Text>
            </View>

            <View style={styles.billRow}>
                <Text style={styles.billLabel}>Feeding India donation</Text>
                <Text style={styles.billVal}>{formatPrice(donationAmount)}</Text>
            </View>

            <View style={styles.divider} />
            
            <View style={styles.billRow}>
                <Text style={styles.toPayLabel}>To pay</Text>
                <Text style={styles.toPayVal}>{formatPrice(finalToPay)}</Text>
            </View>
        </View>

        {/* DONATION */}
        <View style={styles.donationCard}>
            <View>
                <Text style={styles.donationTitle}>Donate to Feeding India</Text>
                <Text style={styles.donationSub}>Help serve a brighter future</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 <Text style={{fontWeight: 'bold', marginRight: 10}}>₹5</Text>
                 <Switch 
                    value={donate} 
                    onValueChange={setDonate} 
                    trackColor={{false: "#767577", true: "#e23744"}}
                    thumbColor={"#fff"}
                />
            </View>
        </View>

      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={styles.footerContainer}>
            
            {/* Insufficient Balance Warning */}
            {isInsufficientWallet && (
                 <View style={styles.warningStrip}>
                     <Text style={styles.warningText}>Insufficient balance. Add money or pay remaining via card.</Text>
                 </View>
            )}

            <View style={styles.footerContent}>
                
                {/* Wallet Checkbox */}
                <TouchableOpacity style={styles.walletRow} onPress={() => setUseWallet(!useWallet)}>
                    <MaterialCommunityIcons 
                        name={useWallet ? "checkbox-marked" : "checkbox-blank-outline"} 
                        size={24} 
                        color={useWallet ? "#e23744" : "#888"} 
                    />
                    <View style={{marginLeft: 10}}>
                         <Text style={styles.walletLabel}>Use <Text style={{fontWeight:'bold'}}>₹{Math.min(balance, finalToPay).toFixed(2)}</Text> from Wallet</Text>
                         <Text style={styles.walletSub}>Balance: ₹{balance}</Text>
                    </View>
                </TouchableOpacity>

                {/* Main Action Bar */}
                <View style={styles.payActionRow}>
                     <View>
                         <Text style={styles.payMethodLabel}>PAY USING</Text>
                         <TouchableOpacity style={styles.methodSelector}>
                             <Text style={styles.selectedMethod}>
                                 {useWallet && balance >= finalToPay ? 'Yumigo Wallet' : 'Visa / Mastercard'}
                             </Text>
                             <Ionicons name="caret-up" size={10} color="#333" style={{marginLeft: 4}} />
                         </TouchableOpacity>
                     </View>

                     <TouchableOpacity 
                        style={[styles.placeOrderBtn, loading && {opacity: 0.7}]} 
                        onPress={handleCheckout}
                        disabled={loading}
                    >
                         {loading ? <ActivityIndicator color="#fff" /> : (
                             <View>
                                 <Text style={styles.btnTotal}>{formatPrice(remainingToPay)}</Text>
                                 <Text style={styles.btnLabel}>Place Order <Ionicons name="caret-forward" size={14} color="#fff"/></Text>
                             </View>
                         )}
                     </TouchableOpacity>
                </View>
            </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f2f2f2' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyCartImage: { width: 120, height: 120, marginBottom: 20 },
  emptyText: { fontSize: 20, fontWeight: 'bold' },
  subText: { color: '#888', marginBottom: 20 },
  goBackBtn: { padding: 10, backgroundColor: '#e23744', borderRadius: 8 },
  goBackText: { color: '#fff', fontWeight: 'bold' },

  // HEADER
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, paddingTop: 45, backgroundColor: '#fff', elevation: 2 },
  headerTextContainer: { flex: 1, marginLeft: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  deliveryTimeTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fff4', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  deliveryTimeText: { fontSize: 12, color: 'green', fontWeight: 'bold', marginRight: 4 },

  // GOLD BANNER
  goldBanner: { backgroundColor: '#fff9c4', padding: 12, alignItems: 'center' },
  goldText: { color: '#333', fontSize: 13 },

  // COMMON CARD STYLE
  sectionCard: { backgroundColor: '#fff', marginHorizontal: 10, marginTop: 10, borderRadius: 12, padding: 15, elevation: 1 },
  
  // DELIVERY
  deliveryRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  iconBox: { width: 35, height: 35, borderRadius: 8, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  addressText: { color: '#666', fontSize: 13, width: '90%' },
  contactName: { color: '#444', fontWeight: '500' },
  changeText: { color: '#e23744', fontWeight: 'bold', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10, marginLeft: 45 },

  // ITEM ROW
  itemRow: { flexDirection: 'row', marginBottom: 20 },
  vegIconContainer: { marginRight: 10, justifyContent: 'flex-start', marginTop: 4, position: 'relative' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, color: '#333', fontWeight: '500' },
  itemPrice: { fontSize: 14, color: '#333', marginTop: 2 },
  qtyContainer: { alignItems: 'flex-end' },
  qtyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e23744', borderRadius: 8, paddingHorizontal: 5, height: 30, marginBottom: 5 },
  qtyBtn: { color: '#e23744', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 8 },
  qtyNum: { color: '#e23744', fontSize: 14, fontWeight: 'bold' },
  itemFinalPrice: { fontSize: 14, fontWeight: 'bold', color: '#333' },

  // OFFER
  offerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 10, marginTop: 10, padding: 15, borderRadius: 12 },
  offerText: { flex: 1, marginLeft: 10, fontWeight: 'bold', color: '#333' },

  // TIPS
  tipSub: { fontSize: 12, color: '#888', marginBottom: 10 },
  tipScroll: { flexDirection: 'row' },
  tipBtn: { width: 70, height: 50, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', alignItems: 'center', justifyContent: 'center', marginRight: 10, elevation: 1 },
  tipBtnActive: { backgroundColor: '#ffeef0', borderColor: '#e23744' },
  tipEmoji: { fontSize: 16 },
  tipText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  tipTextActive: { color: '#e23744' },

  // BILL
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel: { fontSize: 13, color: '#555' },
  billVal: { fontSize: 13, color: '#333' },
  toPayLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  toPayVal: { fontSize: 16, fontWeight: 'bold', color: '#333' },

  // DONATION & CANCEL
  donationCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 12 },
  donationTitle: { fontWeight: 'bold', fontSize: 14 },
  donationSub: { color: '#888', fontSize: 11 },
  cancellationCard: { margin: 10, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 12 },
  cancelTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 5, letterSpacing: 1 },
  cancelText: { fontSize: 11, color: '#888', lineHeight: 16 },

  // FOOTER
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', elevation: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  warningStrip: { backgroundColor: '#fff9c4', padding: 8, alignItems: 'center' },
  warningText: { fontSize: 11, color: '#856404', fontWeight: 'bold' },
  footerContent: { padding: 15 },
  walletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  walletLabel: { fontSize: 14, color: '#333' },
  walletSub: { fontSize: 12, color: '#888' },
  
  payActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payMethodLabel: { fontSize: 10, color: '#888', fontWeight: 'bold', letterSpacing: 0.5 },
  methodSelector: { flexDirection: 'row', alignItems: 'center' },
  selectedMethod: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  placeOrderBtn: { backgroundColor: '#e23744', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 25, width: 160, alignItems: 'center', justifyContent: 'center' },
  btnTotal: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  btnLabel: { color: '#fff', fontSize: 12, fontWeight: '600', textAlign: 'center' }
});