import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TextInput, 
  TouchableOpacity, StatusBar, FlatList, ActivityIndicator, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Keep this if using hook, but props are better here
import { useTheme } from '../context/ThemeContext'; 
import { useAuth } from '../context/AuthContext';
import { useAI } from '../context/AIContext'; 

const { width } = Dimensions.get('window');

// 👇 UPDATED SIGNATURE: Accept 'route' to get params
export default function HomeScreen({ navigation, route }) {
  const { user } = useAuth();
  const { openChat } = useAI(); 
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { colors, isDarkMode } = useTheme();

  // 1. Check for Synced Ride Data (Eat-to-Earn Feature)
  const { syncedRideId, rideDuration, dropLocation } = route?.params || {};

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 17) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  useEffect(() => {
    fetch("https://yumigo-api.onrender.com/api/restaurant/list")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setRestaurants(json.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
        openChat(searchQuery); 
        setSearchQuery('');
    }
  };

  // 🟢 2. RENDER SYNC BANNER (Shows only if ride is active)
  const renderSyncBanner = () => {
    if (!syncedRideId) return null;
    return (
        <View style={styles.syncBanner}>
            <View style={{flex: 1}}>
                <Text style={styles.syncTitle}>🚗 Ride-Food Sync Active</Text>
                <Text style={styles.syncSub}>
                    Delivering to <Text style={{fontWeight:'bold'}}>{dropLocation || "Destination"}</Text> in ~{rideDuration} mins.
                </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.setParams({ syncedRideId: null })}>
                <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
  };

  // ... (FilterChip & PromoBanner Helper Components - Same as before)
  const FilterChip = ({ icon, label }) => (
    <TouchableOpacity style={[styles.chip, { backgroundColor: colors.card, borderColor: isDarkMode ? '#333' : '#eee' }]}>
        {icon && <Ionicons name={icon} size={16} color={colors.text} style={{marginRight: 5}} />}
        <Text style={{ color: colors.text, fontWeight: '600', fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );

  const PromoBanner = ({ image, title, subtitle }) => (
    <View style={styles.bannerContainer}>
        <Image source={{ uri: image }} style={styles.bannerImage} />
        <View style={styles.bannerOverlay} />
        <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>{title}</Text>
            <Text style={styles.bannerSub}>{subtitle}</Text>
            <TouchableOpacity style={styles.bannerBtn}>
                <Text style={styles.bannerBtnText}>Order Now</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="location" size={20} color="#FF9900" />
                <Text style={[styles.locationText, { color: colors.text }]}> Home • Hyderabad</Text>
                <Ionicons name="chevron-down" size={14} color={colors.text} style={{marginLeft: 5}} />
            </View>
            <Text style={styles.greetingSub}>{getGreeting()}, {user?.name || 'Foodie'}!</Text>
        </View>
        
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.coinBadge}>
                <Text style={{fontSize: 12, fontWeight: 'bold', color: '#B8860B'}}>🟡 450</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image 
                  source={user?.profileImage ? { uri: user.profileImage } : { uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
                  style={styles.profilePic} 
                />
            </TouchableOpacity>
        </View>
      </View>

      {/* 👇 3. INSERT SYNC BANNER HERE */}
      {renderSyncBanner()}

      {/* SEARCH BAR */}
      <View style={[styles.searchWrapper, { backgroundColor: colors.background }]}>
        <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5' }]}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput 
                placeholder="Ask Yumi: 'Best spicy pizza'..." 
                placeholderTextColor="#888"
                style={[styles.searchInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery} 
                onSubmitEditing={handleSearch} 
            />
            <TouchableOpacity onPress={handleSearch} style={styles.micBtn}>
                <Text style={{fontSize:16}}>🤖</Text>
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* CHIPS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10, paddingLeft: 20 }}>
            <FilterChip icon="options-outline" label="Sort" />
            <FilterChip icon="flash-outline" label="Fast" />
            <FilterChip icon="pricetag-outline" label="Offers" />
            <FilterChip label="Rating 4.0+" />
            <FilterChip label="Veg" />
            <View style={{width: 30}} />
        </ScrollView>

        {/* BANNERS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled style={{ marginBottom: 20 }}>
            <PromoBanner image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg" title="50% OFF" subtitle="On First Order" />
            <PromoBanner image="https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg" title="Burger Fest" subtitle="Starts @ ₹99" />
        </ScrollView>

        {/* CATEGORIES */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>What's on your mind?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['Biryani', 'Pizza', 'Burger', 'Thali', 'Rolls', 'Cake'].map((item, index) => (
                    <TouchableOpacity key={index} style={styles.catItem} onPress={() => openChat(`Show me best ${item}`)}>
                        <Image source={{ uri: `https://source.unsplash.com/200x200/?${item}` }} style={styles.catImage} />
                        <Text style={[styles.catText, { color: colors.text }]}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* RESTAURANT LIST */}
        <Text style={[styles.sectionTitle, { margin: 20, color: colors.text }]}>
             {restaurants.length} Restaurants Delivering
        </Text>

        {loading ? (
            <ActivityIndicator size="large" color="#FF9900" />
        ) : (
            restaurants.map((item) => (
                <TouchableOpacity 
                    key={item._id}
                    style={[styles.vCard, { backgroundColor: colors.card }]}
                    onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
                >
                    <View style={styles.vCardRow}>
                        <Image source={{ uri: item.image }} style={styles.vCardImage} />
                        <View style={styles.vCardInfo}>
                            <Text style={[styles.vCardTitle, { color: colors.text }]}>{item.name}</Text>
                            <View style={styles.ratingRow}>
                                <View style={styles.ratingBadge}><Text style={{color: '#fff', fontSize: 10, fontWeight: 'bold'}}>4.5 ★</Text></View>
                                <Text style={[styles.vCardMeta, { color: colors.text }]}> • 35-40 mins</Text>
                            </View>
                            <Text style={styles.cuisineText}>{item.category || "North Indian, Chinese"}</Text>
                            <View style={styles.offerTag}>
                                <Ionicons name="pricetag" size={12} color="#fff" />
                                <Text style={{color: '#fff', fontSize: 10, marginLeft: 5, fontWeight: 'bold'}}>60% OFF</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, paddingTop: 10 },
  locationText: { fontWeight: 'bold', fontSize: 16 },
  greetingSub: { color: '#888', fontSize: 12, marginTop: 2 },
  coinBadge: { backgroundColor: '#FFF8E1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginRight: 10, borderWidth: 1, borderColor: '#FFD54F' },
  profilePic: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#eee', borderWidth: 1, borderColor: '#FF9900' },

  // New Banner Style
  syncBanner: { backgroundColor: '#4CAF50', margin: 15, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 5 },
  syncTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  syncSub: { color: '#e8f5e9', fontSize: 12, marginTop: 4, maxWidth: 250 },

  searchWrapper: { paddingHorizontal: 15, paddingBottom: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  micBtn: { padding: 5, paddingLeft: 10 },

  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, marginRight: 10 },

  bannerContainer: { width: width - 40, height: 160, marginHorizontal: 20, borderRadius: 15, overflow: 'hidden', marginRight: 0 },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  bannerTextContainer: { position: 'absolute', bottom: 20, left: 20 },
  bannerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  bannerSub: { color: '#eee', fontSize: 14, marginBottom: 10 },
  bannerBtn: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5, alignSelf: 'flex-start' },
  bannerBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, letterSpacing: 0.5 },
  catItem: { alignItems: 'center', marginRight: 20 },
  catImage: { width: 70, height: 70, borderRadius: 35, marginBottom: 8 },
  catText: { fontSize: 12, fontWeight: '600' },

  vCard: { marginHorizontal: 20, marginBottom: 20, borderRadius: 15, elevation: 2, padding: 12 },
  vCardRow: { flexDirection: 'row' },
  vCardImage: { width: 100, height: 100, borderRadius: 12 },
  vCardInfo: { flex: 1, marginLeft: 15 },
  vCardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  ratingBadge: { backgroundColor: 'green', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  vCardMeta: { fontSize: 12, fontWeight: 'bold' },
  cuisineText: { color: '#888', fontSize: 12, marginBottom: 5 },
  offerTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#9C27B0', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, marginTop: 5 },
});