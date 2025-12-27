import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 
import { useAuth } from '../context/AuthContext';

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();

  // Initialize state with current context user data
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Load data when screen opens
  useEffect(() => {
    if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setDob(user.dob || '');
        setGender(user.gender || '');
        setImage(user.profileImage || null);
    }
  }, [user]);

  const pickImage = async (useCamera = false) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to make this work!');
      return;
    }

    let result;
    const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    };

    if (useCamera) {
        result = await ImagePicker.launchCameraAsync(options);
    } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
        setImage(result.assets[0].uri); // Set local state immediately
        setModalVisible(false);
    }
  };

  const deletePhoto = () => {
    setImage(null);
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (name.length === 0) {
        Alert.alert("Error", "Name cannot be empty");
        return;
    }

    // SAVE TO CONTEXT & STORAGE
    await updateUser({ 
        name, 
        email, 
        phone, 
        dob, 
        gender, 
        profileImage: image // This saves the URI
    });
    
    Alert.alert("Success", "Profile Updated! ✅");
    navigation.goBack();
  };

  // ... (Keep the renderInput function and styles from the previous code) ...
  // Re-paste the rest of the Render logic below for completeness
  
  const renderInput = ({ label, value, onChangeText, actionText, isEditable = true }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.floatingLabel}>{label}</Text>
        <View style={styles.inputRow}>
            <TextInput 
                style={styles.inputField}
                value={value}
                onChangeText={onChangeText}
                editable={isEditable}
            />
            {actionText && (
                <TouchableOpacity onPress={() => isEditable ? onChangeText('') : null}>
                   <Text style={styles.actionText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
                {/* LOGIC TO SHOW IMAGE OR PLACEHOLDER */}
                {image ? (
                    <Image source={{ uri: image }} style={styles.avatarImage} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitial}>
                            {name ? name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                )}
                
                <TouchableOpacity style={styles.editIconContainer} onPress={() => setModalVisible(true)}>
                    <Ionicons name="pencil" size={14} color="#333" />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.formCard}>
            {renderInput({ label: 'Name', value: name, onChangeText: setName, actionText: 'CLEAR' })}
            {renderInput({ label: 'Mobile', value: phone, onChangeText: setPhone, actionText: 'CHANGE', isEditable: false })}
            {renderInput({ label: 'Email', value: email, onChangeText: setEmail, actionText: 'CHANGE' })}
            {renderInput({ label: 'Date of birth', value: dob, onChangeText: setDob, actionText: 'CLEAR' })}
            {renderInput({ label: 'Gender', value: gender, onChangeText: setGender })}
        </View>

        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={handleSave}>
                <Text style={styles.updateButtonText}>Update profile</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Logic */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Profile Photo</Text>
                <TouchableOpacity style={styles.modalOption} onPress={deletePhoto}>
                    <Ionicons name="trash-outline" size={24} color="#333" />
                    <Text style={styles.modalOptionText}>Delete Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalOption} onPress={() => pickImage(false)}>
                    <Ionicons name="images-outline" size={24} color="#333" />
                    <Text style={styles.modalOptionText}>Choose from gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalOption} onPress={() => pickImage(true)}>
                    <Ionicons name="camera-outline" size={24} color="#333" />
                    <Text style={styles.modalOptionText}>Take photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// STYLES (Same as before)
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  avatarContainer: { alignItems: 'center', marginVertical: 20 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#D4AF37' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#D4AF37' },
  avatarInitial: { fontSize: 40, color: '#D4AF37', fontWeight: 'bold' },
  editIconContainer: { position: 'absolute', bottom: 0, right: 5, backgroundColor: '#fff', padding: 6, borderRadius: 15, elevation: 4 },
  formCard: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, minHeight: 500, elevation: 5 },
  inputContainer: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 8, marginBottom: 20 },
  floatingLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputField: { fontSize: 16, color: '#333', fontWeight: '500', flex: 1, paddingVertical: 4 },
  actionText: { fontSize: 12, fontWeight: 'bold', color: '#e23744' },
  footerContainer: { padding: 25, backgroundColor: '#fff' },
  updateButton: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  updateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalOptionText: { fontSize: 16, marginLeft: 15 },
  cancelButton: { marginTop: 15, paddingVertical: 15, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: 'bold' }
});