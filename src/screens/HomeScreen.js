import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TextInput, 
  TouchableOpacity, StatusBar, FlatList, ActivityIndicator, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext'; 
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth(); // <--- Get user data from Context
  const navigation = useNavigation();
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 🎨 Theme Hook
  const { colors, isDarkMode } = useTheme();

  // Smart Greeting
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

  // 🟢 COMPONENTS
  
  // 1. Filter Chip
  const FilterChip = ({ icon, label }) => (
    <TouchableOpacity style={[styles.chip, { backgroundColor: colors.card, borderColor: isDarkMode ? '#333' : '#eee' }]}>
        {icon && <Ionicons name={icon} size={16} color={colors.text} style={{marginRight: 5}} />}
        <Text style={{ color: colors.text, fontWeight: '600', fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );

  // 2. Banner Item
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

      {/* 🟢 1. ADVANCED HEADER */}
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
            {/* Coin Balance (Gamification) */}
            <View style={styles.coinBadge}>
                <Text style={{fontSize: 12, fontWeight: 'bold', color: '#B8860B'}}>🟡 450</Text>
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                {/* 👇 DYNAMIC IMAGE LOGIC */}
                <Image 
                  source={
                    user?.profileImage 
                      ? { uri: user.profileImage } 
                      : { uri: 'https://randomuser.me/api/portraits/men/1.jpg' } // Fallback
                  } 
                  style={styles.profilePic} 
                />
            </TouchableOpacity>
        </View>
      </View>

      {/* 🟢 2. STICKY SEARCH BAR */}
      <View style={[styles.searchWrapper, { backgroundColor: colors.background }]}>
        <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5' }]}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput 
                placeholder="Biryani, Pizza, 'Chaat'..." 
                placeholderTextColor="#888"
                style={[styles.searchInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery} 
            />
            <View style={styles.micBtn}>
                <Ionicons name="mic" size={18} color="#FF9900" />
            </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* 🟢 3. FILTER CHIPS (Horizontal) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10, paddingLeft: 20 }}>
            <FilterChip icon="options-outline" label="Sort" />
            <FilterChip icon="flash-outline" label="Fast Delivery" />
            <FilterChip icon="pricetag-outline" label="Offers" />
            <FilterChip label="Rating 4.0+" />
            <FilterChip label="Pure Veg" />
            <View style={{width: 30}} />
        </ScrollView>

        {/* 🟢 4. FEATURED BANNERS (Horizontal) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled style={{ marginBottom: 20 }}>
            <PromoBanner 
                image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg" 
                title="50% OFF" subtitle="On First Order" 
            />
            <PromoBanner 
                image="https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg" 
                title="Burger Fest" subtitle="Starts @ ₹99" 
            />
        </ScrollView>

        {/* 🟢 5. "WHAT'S ON YOUR MIND?" (Grid Categories) */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>What's on your mind?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['Biryani', 'Pizza', 'Burger', 'Thali', 'Rolls', 'Cake'].map((item, index) => (
                    <View key={index} style={styles.catItem}>
                        <Image source={{ uri: `https://source.unsplash.com/200x200/?${item}` }} style={styles.catImage} />
                        <Text style={[styles.catText, { color: colors.text }]}>{item}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>

        {/* 🟢 6. HORIZONTAL "TOP PICKS" */}
        <View style={{ marginBottom: 20 }}>
            <Text style={[styles.sectionTitle, { marginLeft: 20, color: colors.text }]}>Top Picks for You 🌟</Text>
            <FlatList
                horizontal
                data={restaurants.slice(0, 5)} // Take first 5
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 20 }}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[styles.hCard, { backgroundColor: colors.card }]}
                        onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
                    >
                        <Image source={{ uri: item.image }} style={styles.hCardImage} />
                        <View style={{padding: 10}}>
                            <Text style={[styles.hCardTitle, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.hCardTime}>🕒 25 mins • ⭐ 4.2</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>

        {/* 🟢 7. SPOTLIGHT BANNER */}
        <View style={styles.spotlightContainer}>
            <View style={styles.spotlightHeader}>
                <Text style={styles.spotlightTitle}>IN THE SPOTLIGHT</Text>
            </View>
            <Image 
                source={{ uri: 'https://b.zmtcdn.com/data/pictures/chains/1/18412861/b35e808163cb6440263f6952d7ee6048.jpg' }} 
                style={styles.spotlightImage} 
            />
            <View style={[styles.spotlightInfo, { backgroundColor: colors.card }]}>
                <Text style={[styles.spotlightName, { color: colors.text }]}>Paradise Biryani</Text>
                <Text style={{color: 'green', fontWeight: 'bold'}}>Flat ₹125 OFF</Text>
            </View>
        </View>

        {/* 🟢 8. ALL RESTAURANTS (Vertical List) */}
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
                            <Text style={styles.vCardAddress}>{item.address || "Hyderabad"}</Text>
                            
                            <View style={styles.offerTag}>
                                <Ionicons name="pricetag" size={12} color="#fff" />
                                <Text style={{color: '#fff', fontSize: 10, marginLeft: 5, fontWeight: 'bold'}}>60% OFF up to ₹120</Text>
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
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, paddingTop: 10 },
  locationText: { fontWeight: 'bold', fontSize: 16 },
  greetingSub: { color: '#888', fontSize: 12, marginTop: 2 },
  coinBadge: { backgroundColor: '#FFF8E1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginRight: 10, borderWidth: 1, borderColor: '#FFD54F' },
  profilePic: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#eee', borderWidth: 1, borderColor: '#FF9900' }, // Added border

  // Search
  searchWrapper: { paddingHorizontal: 15, paddingBottom: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  micBtn: { padding: 5, borderLeftWidth: 1, borderLeftColor: '#ddd', paddingLeft: 10 },

  // Chips
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, marginRight: 10 },

  // Banners
  bannerContainer: { width: width - 40, height: 160, marginHorizontal: 20, borderRadius: 15, overflow: 'hidden', marginRight: 0 },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  bannerTextContainer: { position: 'absolute', bottom: 20, left: 20 },
  bannerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  bannerSub: { color: '#eee', fontSize: 14, marginBottom: 10 },
  bannerBtn: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5, alignSelf: 'flex-start' },
  bannerBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12 },

  // Categories
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, letterSpacing: 0.5 },
  catItem: { alignItems: 'center', marginRight: 20 },
  catImage: { width: 70, height: 70, borderRadius: 35, marginBottom: 8 },
  catText: { fontSize: 12, fontWeight: '600' },

  // Horizontal Card
  hCard: { width: 220, borderRadius: 15, marginRight: 15, elevation: 3, marginBottom: 10 },
  hCardImage: { width: '100%', height: 130, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  hCardTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  hCardTime: { color: '#888', fontSize: 12, marginTop: 3 },

  // Spotlight
  spotlightContainer: { marginHorizontal: 20, marginVertical: 10, borderRadius: 15, overflow: 'hidden', elevation: 4 },
  spotlightHeader: { position: 'absolute', top: 15, left: -5, backgroundColor: '#000', paddingHorizontal: 10, paddingVertical: 4, zIndex: 1, borderTopRightRadius: 5, borderBottomRightRadius: 5 },
  spotlightTitle: { color: '#fff', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  spotlightImage: { width: '100%', height: 180 },
  spotlightInfo: { padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  spotlightName: { fontSize: 18, fontWeight: 'bold' },

  // Vertical Card
  vCard: { marginHorizontal: 20, marginBottom: 20, borderRadius: 15, elevation: 2, padding: 12 },
  vCardRow: { flexDirection: 'row' },
  vCardImage: { width: 100, height: 100, borderRadius: 12 },
  vCardInfo: { flex: 1, marginLeft: 15 },
  vCardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  ratingBadge: { backgroundColor: 'green', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  vCardMeta: { fontSize: 12, fontWeight: 'bold' },
  cuisineText: { color: '#888', fontSize: 12, marginBottom: 5 },
  vCardAddress: { color: '#aaa', fontSize: 11 },
  offerTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#9C27B0', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, marginTop: 5 },
});