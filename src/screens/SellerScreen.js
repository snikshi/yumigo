import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, Image, 
  TextInput, Alert, Modal, ActivityIndicator, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker'; // 👈 1. IMPORT IMAGE PICKER

export default function SellerScreen() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', category: 'Electronics', image: ''
  });

  const API_URL = "https://yumigo-api.onrender.com/api/products"; 

  // 1. Fetch Products
  const fetchMyProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/list`);
      const data = await res.json();
      setProducts(data.slice(0, 5)); 
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // 👇 2. NEW FUNCTION: PICK IMAGE FROM GALLERY
  const pickImage = async () => {
    // Request Permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
        Alert.alert("Permission Denied", "We need access to your gallery!");
        return;
    }

    // Open Gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], // Standard Aspect Ratio
      quality: 0.5,   // Compress image to avoid lag
    });

    if (!result.canceled) {
      // ✅ Save the selected image URI
      setNewProduct({ ...newProduct, image: result.assets[0].uri });
    }
  };

  // 3. Handle Add Product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
        Alert.alert("Error", "Please fill all fields & upload an image");
        return;
    }

    setLoading(true);
    try {
        // NOTE: In a real app, you would UPLOAD the 'newProduct.image' (file://) 
        // to Cloudinary/Firebase here to get a real HTTP URL.
        
        await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...newProduct,
                price: Number(newProduct.price),
                tags: ["user-upload"]
            })
        });
        
        Alert.alert("Success", "Product Live! 🚀");
        setModalVisible(false);
        setNewProduct({ name: '', price: '', category: 'Electronics', image: '' });
        fetchMyProducts(); 
    } catch (error) {
        Alert.alert("Error", "Upload failed");
    } finally {
        setLoading(false);
    }
  };

  if (!user) {
      return (
          <View style={styles.center}>
              <Text>Please Login to Sell items</Text>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111" />
      
      {/* DASHBOARD HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Central 💼</Text>
        <Text style={styles.subTitle}>Welcome back, {user.name}</Text>
        
        <View style={styles.statsRow}>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>₹12,400</Text>
                <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{products.length}</Text>
                <Text style={styles.statLabel}>Active Products</Text>
            </View>
        </View>
      </View>

      {/* MY PRODUCTS LIST */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>My Inventory</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addBtnText}>Add New</Text>
            </TouchableOpacity>
        </View>

        <FlatList
            data={products}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
                <View style={styles.productRow}>
                    <Image source={{ uri: item.image }} style={styles.thumb} />
                    <View style={{flex: 1, marginLeft: 15}}>
                        <Text style={styles.pName}>{item.name}</Text>
                        <Text style={styles.pPrice}>₹{item.price}</Text>
                    </View>
                    <Ionicons name="pencil-outline" size={20} color="#666" />
                </View>
            )}
        />
      </View>

      {/* MODAL: ADD PRODUCT FORM */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sell a Product 📦</Text>
                
                <TextInput 
                    placeholder="Product Name" 
                    style={styles.input} 
                    value={newProduct.name}
                    onChangeText={t => setNewProduct({...newProduct, name: t})}
                />
                
                <TextInput 
                    placeholder="Price (₹)" 
                    style={styles.input} 
                    keyboardType="numeric"
                    value={newProduct.price}
                    onChangeText={t => setNewProduct({...newProduct, price: t})}
                />

                {/* 👇 IMAGE PICKER UI */}
                <Text style={styles.label}>Product Image</Text>
                <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                    {newProduct.image ? (
                        <Image source={{ uri: newProduct.image }} style={styles.previewImage} />
                    ) : (
                        <View style={{alignItems: 'center'}}>
                            <Ionicons name="camera" size={30} color="#666" />
                            <Text style={{color: '#666'}}>Tap to Upload Photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.uploadBtn} 
                    onPress={handleAddProduct}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadText}>List Item Now</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop: 15}}>
                    <Text style={{color: 'red', textAlign: 'center'}}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#111', padding: 20, paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subTitle: { color: '#888', marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { backgroundColor: '#222', width: '48%', padding: 15, borderRadius: 10, alignItems: 'center' },
  statNumber: { color: '#4CAF50', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#aaa', fontSize: 12 },
  listContainer: { flex: 1, padding: 20 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  addBtn: { backgroundColor: '#000', flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 20, paddingHorizontal: 15 },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  productRow: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 10, marginBottom: 10, alignItems: 'center', elevation: 2 },
  thumb: { width: 50, height: 50, borderRadius: 8 },
  pName: { fontWeight: 'bold', fontSize: 14 },
  pPrice: { color: 'green', fontWeight: 'bold' },
  
  // Updated Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 10 },
  label: { fontWeight: 'bold', marginBottom: 5, marginTop: 5 },
  
  imagePickerBtn: { height: 150, backgroundColor: '#f0f0f0', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' },
  previewImage: { width: '100%', height: '100%' },

  uploadBtn: { backgroundColor: '#000', padding: 15, borderRadius: 10, alignItems: 'center' },
  uploadText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});