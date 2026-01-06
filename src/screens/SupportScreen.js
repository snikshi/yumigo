import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, 
  KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAI } from '../context/AIContext'; // 👈 Connect to Brain

export default function SupportScreen({ navigation }) {
  // 🟢 USE GLOBAL AI CONTEXT
  const { messages, sendMessage, loading } = useAI(); 
  
  const [input, setInput] = useState('');
  const flatListRef = useRef();

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input); // 👈 Calls Real AI Backend
    setInput('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#232f3e" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Yumi Support AI</Text>
            <Text style={styles.headerSub}>Online • AI Agent 🤖</Text>
        </View>
        <Ionicons name="headset" size={24} color="#fff" />
      </View>

      {/* CHAT AREA */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        onContentSizeChange={() => flatListRef.current.scrollToEnd()}
        contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <View style={[
              styles.bubble, 
              isUser ? styles.userBubble : styles.botBubble
            ]}>
              <Text style={[
                styles.msgText, 
                isUser ? styles.userText : styles.botText
              ]}>{item.text}</Text>
              
              {/* Show small timestamp or status if needed */}
              {item.sender === 'ai' && item.action === 'support' && (
                <Text style={{fontSize: 10, color: '#666', marginTop: 5}}>Checking Order Status...</Text>
              )}
            </View>
          );
        }}
      />

      {/* INPUT AREA */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inputContainer}>
            <TextInput 
                style={styles.input} 
                placeholder="Describe your issue..." 
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Ionicons name="send" size={20} color="#fff" />
                )}
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: { backgroundColor: '#232f3e', padding: 15, paddingTop: 50, flexDirection: 'row', alignItems: 'center' },
  headerInfo: { flex: 1, marginLeft: 15 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerSub: { color: '#4CAF50', fontSize: 12, fontWeight: 'bold' },

  bubble: { maxWidth: '80%', padding: 12, borderRadius: 15, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#FF9900', borderBottomRightRadius: 2 },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 2 },
  
  msgText: { fontSize: 16 },
  userText: { color: '#fff' },
  botText: { color: '#333' },

  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center', elevation: 5 },
  input: { flex: 1, backgroundColor: '#f0f0f0', padding: 12, borderRadius: 25, marginRight: 10, fontSize: 16 },
  sendBtn: { backgroundColor: '#232f3e', padding: 12, borderRadius: 25 },
});