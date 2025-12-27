import React from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, 
  SafeAreaView, Switch, Alert, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useTheme } from '../context/ThemeContext'; 

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { transactions, balance } = useWallet();
  const { isDarkMode, toggleTheme, colors } = useTheme(); 
  
  // 1. Safe Data Extraction
  const safeName = user?.name || "Guest User";
  const safeEmail = user?.email || "No Email";
  const safeBalance = (balance || 0).toLocaleString('en-IN');

  // 2. Dynamic Image Logic (Matches Edit Screen)
  const profileImageSource = user?.profileImage 
    ? { uri: user.profileImage } 
    : { uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' };

  // 3. Logout Confirmation
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: logout }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
             <Image 
                source={profileImageSource} 
                style={styles.avatar} 
             />
             {/* Small Edit Pencil Badge */}
             <View style={styles.editBadge}>
                <Ionicons name="pencil" size={10} color="#fff" />
             </View>
          </TouchableOpacity>

          <View style={{flex: 1}}>
              <Text style={[styles.name, { color: colors.text }]}>{safeName}</Text>
              <Text style={styles.email}>{safeEmail}</Text>
              
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.editBtn}>
                  <Text style={styles.editLink}>Edit Profile</Text>
                  <Ionicons name="chevron-forward" size={12} color="orange" />
              </TouchableOpacity>
          </View>
        </View>

        {/* WALLET CARD */}
        <TouchableOpacity 
            style={styles.walletCard} 
            onPress={() => navigation.navigate('Wallet')}
            activeOpacity={0.9}
        >
          <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                 <Ionicons name="wallet" size={16} color="#FFD700" style={{marginRight: 6}} />
                 <Text style={styles.walletLabel}>YUMI WALLET</Text>
              </View>
              <Text style={styles.balance} numberOfLines={1} adjustsFontSizeToFit>
                ₹ {safeBalance}
              </Text>
          </View>
          <View style={styles.walletIconBox}>
             <Ionicons name="add" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
        

        {/* SETTINGS SECTION */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
        
        {/* Dark Mode Switch */}
        <View style={[styles.menuItem, { backgroundColor: colors.card }]}>
            <View style={[styles.menuIconBox, { backgroundColor: isDarkMode ? '#333' : '#f0f0f0' }]}>
                <Ionicons name={isDarkMode ? "moon" : "sunny"} size={22} color={isDarkMode ? "#FFD700" : "#333"} />
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuLabel, { color: colors.text }]}>{isDarkMode ? "Dark Mode" : "Light Mode"}</Text>
                <Text style={styles.menuSubtext}>Adjust app appearance</Text>
            </View>
            <Switch 
                value={isDarkMode} 
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: "green" }}
                thumbColor={"#f4f3f4"}
            />
        </View>

        {/* ACCOUNT LINKS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>My Account</Text>

        <MenuLink 
            icon="receipt-outline" 
            label="Your Orders" 
            onPress={() => navigation.navigate('History')} 
            colors={colors} isDarkMode={isDarkMode} 
        />
        
        <MenuLink 
            icon="car-sport-outline" 
            label="Ride History" 
            onPress={() => navigation.navigate('RideHistory')} 
            colors={colors} isDarkMode={isDarkMode} 
        />

        <MenuLink 
            icon="chatbubble-ellipses-outline" 
            label="Help & Support" 
            onPress={() => navigation.navigate('Support')} 
            colors={colors} isDarkMode={isDarkMode} iconColor="green" bg="#e8f5e9"
        />

        {/* RECENT TRANSACTIONS PREVIEW */}
        <View style={styles.transHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
                <Text style={{color: 'orange', fontWeight: 'bold', fontSize: 12}}>See All</Text>
            </TouchableOpacity>
        </View>

        {transactions.length > 0 ? (
            transactions.slice(0, 3).map((item, index) => (
                <View key={index} style={[styles.transactionRow, { backgroundColor: colors.card }]}>
                    <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#333' : '#f0f0f0' }]}>
                        <Ionicons 
                            name={item.type === 'credit' ? "arrow-down" : "arrow-up"} 
                            size={18} 
                            color={item.type === 'credit' ? "green" : "red"} 
                        />
                    </View>
                    <View style={{flex: 1, marginLeft: 15}}>
                        <Text style={[styles.transTitle, { color: colors.text }]}>{item.title || "Transaction"}</Text>
                        <Text style={styles.transDate}>{item.date}</Text>
                    </View>
                    <Text style={[styles.transAmount, { color: item.type === 'credit' ? 'green' : 'red' }]}>
                        {item.type === 'credit' ? '+' : '-'} ₹{item.amount}
                    </Text>
                </View>
            ))
        ) : (
            <Text style={{textAlign: 'center', color: '#888', marginVertical: 10, fontStyle: 'italic'}}>No recent transactions</Text>
        )}

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="red" style={{marginRight: 8}} />
            <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Component to clean up code
const MenuLink = ({ icon, label, onPress, colors, isDarkMode, iconColor, bg }) => (
    <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]} onPress={onPress}>
        <View style={[styles.menuIconBox, { backgroundColor: bg || (isDarkMode ? '#333' : '#f0f0f0') }]}>
            <Ionicons name={icon} size={22} color={iconColor || colors.icon} />
        </View>
        <View style={styles.menuContent}>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.text} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15, borderWidth: 2, borderColor: '#D4AF37' },
  editBadge: { position: 'absolute', bottom: 0, right: 15, backgroundColor: 'orange', borderRadius: 10, padding: 4, borderWidth: 1, borderColor: '#fff' },
  
  name: { fontSize: 22, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#888', marginBottom: 5 },
  editBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  editLink: { color: 'orange', fontWeight: 'bold', fontSize: 14, marginRight: 4 },
  
  walletCard: { backgroundColor: '#1e1e1e', padding: 25, borderRadius: 20, margin: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 8, shadowColor: 'orange', shadowOpacity: 0.3, shadowRadius: 10 },
  walletLabel: { color: '#FFD700', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  balance: { color: '#fff', fontSize: 28, fontWeight: 'bold', flex: 1 }, 
  walletIconBox: { backgroundColor: '#333', padding: 12, borderRadius: 50, borderWidth: 1, borderColor: '#444' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, marginBottom: 15 },
  transHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 20, marginBottom: 15 },
  
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, marginHorizontal: 20, marginBottom: 12, borderRadius: 15, elevation: 1 },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 16, fontWeight: '600' },
  menuSubtext: { fontSize: 12, color: '#888' },
  
  transactionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, marginHorizontal: 20, borderRadius: 12, marginBottom: 10 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  transTitle: { fontSize: 14, fontWeight: '600' },
  transDate: { fontSize: 12, color: '#aaa' },
  transAmount: { fontSize: 14, fontWeight: 'bold' },
  
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, padding: 15, marginBottom: 20, backgroundColor: '#ffebee', marginHorizontal: 20, borderRadius: 15 },
  logoutText: { color: 'red', fontWeight: 'bold', fontSize: 16 },
});