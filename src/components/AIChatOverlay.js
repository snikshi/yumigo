import React, { useState, useRef, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, 
    Animated, Dimensions, FlatList, Image, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAI } from '../context/AIContext'; // 👈 Use Context
import { useCart } from '../context/CartContext';

const { width, height } = Dimensions.get('window');

export default function AIChatOverlay() {
    const { isOpen, closeChat, openChat, messages, sendMessage, loading, sendFeedback } = useAI();
    const { addToCart } = useCart();
    const [input, setInput] = useState('');
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen) {
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
        } else {
            Animated.spring(scaleAnim, { toValue: 0, useNativeDriver: true }).start();
        }
    }, [isOpen]);

    const handleSend = () => {
        sendMessage(input);
        setInput('');
    };

    const renderItem = ({ item }) => {
        const isAi = item.sender === 'ai';
        return (
            <View style={{ alignItems: isAi ? 'flex-start' : 'flex-end', marginBottom: 15 }}>
                <View style={[styles.bubble, isAi ? styles.aiBubble : styles.userBubble]}>
                    <Text style={isAi ? styles.aiText : styles.userText}>{item.text}</Text>
                </View>

                {/* 👍 AUTO-UPGRADE FEEDBACK BUTTONS */}
                {isAi && !item.rated && (
                    <View style={styles.feedbackRow}>
                        <TouchableOpacity onPress={() => sendFeedback(item.id, 5, item.query, item.text)} style={{marginRight: 10}}>
                            <Ionicons name="thumbs-up-outline" size={16} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => sendFeedback(item.id, 1, item.query, item.text)}>
                            <Ionicons name="thumbs-down-outline" size={16} color="#666" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* 🛍️ PRODUCT CARDS */}
                {isAi && item.action === 'search_food' && item.data && (
                    <FlatList 
                        data={item.data}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={i => i._id}
                        style={{ marginTop: 10 }}
                        renderItem={({ item: food }) => (
                            <View style={styles.foodCard}>
                                <Image source={{ uri: food.image }} style={styles.foodImg} />
                                <Text style={styles.foodName}>{food.name}</Text>
                                <Text style={styles.foodPrice}>₹{food.price}</Text>
                                <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(food)}>
                                    <Text style={{color:'#fff', fontSize:10, fontWeight:'bold'}}>ADD +</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}
            </View>
        );
    };

    if (!isOpen) {
        return (
            <TouchableOpacity style={styles.orb} onPress={() => openChat()}>
                <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png'}} style={{width: 35, height: 35}}/>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container} pointerEvents="box-none">
            <Animated.View style={[styles.chatWindow, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.header}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={styles.avatar}><Text style={{fontSize:20}}>🤖</Text></View>
                        <Text style={styles.headerTitle}>Yumi AI</Text>
                    </View>
                    <TouchableOpacity onPress={closeChat}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <FlatList 
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={i => i.id}
                    contentContainerStyle={{ padding: 15 }}
                />

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={styles.inputArea}>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Ask for food or help..." 
                            value={input}
                            onChangeText={setInput}
                            onSubmitEditing={handleSend}
                        />
                        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
                            {loading ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="send" size={18} color="#fff" />}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { position: 'absolute', bottom: 0, right: 0, left: 0, top: 0, zIndex: 999, alignItems: 'flex-end', justifyContent: 'flex-end' },
    orb: { position: 'absolute', bottom: 90, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', elevation: 10 },
    chatWindow: { position: 'absolute', bottom: 100, right: 20, width: width * 0.85, height: height * 0.55, backgroundColor: '#fff', borderRadius: 20, elevation: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#f9f9f9', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    avatar: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    headerTitle: { fontWeight: 'bold', fontSize: 16 },
    bubble: { padding: 10, borderRadius: 15, maxWidth: '80%' },
    userBubble: { backgroundColor: '#FF9900', borderBottomRightRadius: 2 },
    aiBubble: { backgroundColor: '#f0f0f0', borderBottomLeftRadius: 2 },
    userText: { color: '#fff' },
    aiText: { color: '#333' },
    feedbackRow: { flexDirection: 'row', marginTop: 5, marginLeft: 5 },
    inputArea: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#eee' },
    input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 15, height: 40 },
    sendBtn: { width: 40, height: 40, backgroundColor: '#000', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
    foodCard: { width: 130, backgroundColor: '#fff', borderRadius: 10, padding: 8, marginRight: 10, elevation: 2, marginBottom: 5 },
    foodImg: { width: '100%', height: 90, borderRadius: 8, marginBottom: 5 },
    foodName: { fontSize: 12, fontWeight: 'bold', numberOfLines: 1 },
    foodPrice: { fontSize: 12, color: 'green', fontWeight: 'bold' },
    addBtn: { backgroundColor: '#FF9900', padding: 4, borderRadius: 4, alignItems: 'center', marginTop: 5 }
});