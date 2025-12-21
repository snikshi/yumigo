import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TextInput, 
  TouchableOpacity, StatusBar, FlatList, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // To navigate to other tabs

export default function HomeScreen() {
  const navigation = useNavigation();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 👇 FETCH DATA (Just like Food Screen)
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

  // 👇 SEARCH LOGIC
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const newData = restaurants.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredRestaurants(newData);
    } else {
      setFilteredRestaurants(restaurants);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 🟢 HEADER & SEARCH */}
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={24} color="#FF9900" />
          <Text style={styles.locationText}> Home • Hyderabad</Text>
        </View>

        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
            <TextInput 
                placeholder="Search for food or restaurants..." 
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={handleSearch} 
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                    <Ionicons name="close-circle" size={20} color="#ccc" />
                </TouchableOpacity>
            )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* 🟠 CATEGORIES (Only show if NOT searching) */}
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
                scrollEnabled={false} // Let the main ScrollView handle scrolling
                keyExtractor={(item) => item._id}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No restaurants found 😕</Text>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
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
  header: { padding: 15, paddingTop: 10, backgroundColor: '#fff', elevation: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  locationText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  searchContainer: { flexDirection: 'row', backgroundColor: '#f2f2f2', borderRadius: 10, padding: 10, alignItems: 'center' },
  searchInput: { flex: 1, fontSize: 16 },
  
  sectionTitle: { fontSize: 20, fontWeight: 'bold', margin: 15, marginBottom: 10, color: '#333' },
  
  categories: { paddingLeft: 15 },
  catItem: { marginRight: 20, alignItems: 'center' },
  catCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#eee', overflow: 'hidden', marginBottom: 5 },
  catImage: { width: '100%', height: '100%' },
  catText: { fontSize: 12, fontWeight: '600', color: '#555' },

  card: { flexDirection: 'row', marginHorizontal: 15, marginBottom: 15, backgroundColor: '#fff', borderRadius: 15, elevation: 3, padding: 10 },
  cardImage: { width: 90, height: 90, borderRadius: 10, marginRight: 15 },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardMeta: { fontSize: 14, color: '#666', marginTop: 4 },
  cardAddress: { fontSize: 12, color: '#999', marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#888' }
});