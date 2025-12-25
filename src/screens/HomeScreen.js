import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TextInput, 
  TouchableOpacity, StatusBar, FlatList, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext'; 

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth(); 
  
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 👇 SMART GREETING LOGIC
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning ☀️", sub: "Breakfast time?" };
    if (hour < 17) return { text: "Good Afternoon 🌤️", sub: "Lunch break?" };
    return { text: "Good Evening 🌙", sub: "Dinner is served!" };
  };

  const greeting = getGreeting();

  useEffect(() => {
    fetch("https://yumigo-api.onrender.com/api/restaurant/list")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setRestaurants(json.data);
          setFilteredRestaurants(json.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const newData = restaurants.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        return itemData.includes(text.toUpperCase());
      });
      setFilteredRestaurants(newData);
    } else {
      setFilteredRestaurants(restaurants);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 🟢 SMART HEADER */}
      <View style={styles.header}>
        <View>
            <View style={styles.locationRow}>
                <Ionicons name="location" size={24} color="#FF9900" />
                <Text style={styles.locationText}> Home • Hyderabad</Text>
                <Ionicons name="chevron-down" size={16} color="#333" />
            </View>
            {/* 👇 Dynamic Text */}
            <Text style={styles.greetingTitle}>{greeting.text}</Text>
            <Text style={styles.greetingSub}>{greeting.sub}</Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* RIDE BUTTON */}
            <TouchableOpacity 
                style={styles.rideBtn}
                onPress={() => navigation.navigate('Ride')}
            >
                <Ionicons name="car" size={20} color="#fff" />
            </TouchableOpacity>

            {/* PROFILE */}
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image 
                    source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
                    style={styles.profilePic} 
                />
            </TouchableOpacity>
        </View>
      </View>

      {/* 🔍 SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput 
            placeholder="Search for food or restaurants..." 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch} 
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* 🟠 CATEGORIES (Hidden when searching) */}
        {searchQuery === '' && (
          <View>
            <Text style={styles.sectionTitle}>What's on your mind?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
              {['Pizza', 'Burger', 'Biryani', 'Thali', 'Cake'].map((item, index) => (
                <View key={index} style={styles.catItem}>
                  <View style={styles.catCircle}>
                    <Image source={{ uri: `https://source.unsplash.com/100x100/?${item}` }} style={styles.catImage} />
                  </View>
                  <Text style={styles.catText}>{item}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 🟡 RESTAURANT LIST */}
        <Text style={styles.sectionTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : "Top Restaurants Near You"}
        </Text>

        {loading ? (
            <ActivityIndicator size="large" color="#FF9900" style={{marginTop: 20}} />
        ) : (
            <FlatList
                data={filteredRestaurants}
                scrollEnabled={false}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.card}
                        onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
                    >
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardName}>{item.name}</Text>
                            <Text style={styles.cardMeta}>4.5 ⭐ • 30-40 mins</Text>
                            <Text style={styles.cardAddress}>{item.address || "Hyderabad"}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 10, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  
  // New Styles for Smart Greeting
  greetingTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 5 },
  greetingSub: { fontSize: 14, color: '#888' },
  
  rideBtn: { backgroundColor: '#000', padding: 10, borderRadius: 20, marginRight: 10 },
  profilePic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee' },
  
  searchContainer: { marginHorizontal: 20, marginBottom: 10, flexDirection: 'row', backgroundColor: '#f2f2f2', borderRadius: 10, padding: 12, alignItems: 'center' },
  searchInput: { flex: 1, fontSize: 16 },
  
  sectionTitle: { fontSize: 20, fontWeight: 'bold', margin: 20, marginBottom: 10, color: '#333' },
  categories: { paddingLeft: 20 },
  catItem: { marginRight: 20, alignItems: 'center' },
  catCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#eee', overflow: 'hidden', marginBottom: 5 },
  catImage: { width: '100%', height: '100%' },
  catText: { fontSize: 12, fontWeight: '600', color: '#555' },

  card: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 15, backgroundColor: '#fff', borderRadius: 15, elevation: 3, padding: 10 },
  image: { width: 90, height: 90, borderRadius: 10, marginRight: 15 },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardMeta: { fontSize: 14, color: '#666', marginTop: 4 },
  cardAddress: { fontSize: 12, color: '#999', marginTop: 2 }
});