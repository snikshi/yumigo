import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, 
  KeyboardAvoidingView, Platform, Image, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SupportScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: '1', text: "Hi there! 👋 Welcome to Yumigo Support.", sender: 'bot' },
    { id: '2', text: "How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef();

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // 👇 FAKE BOT REPLY LOGIC
    setTimeout(() => {
      let botReply = "Thanks! Our agent will check this shortly. 🕒";
      
      if (input.toLowerCase().includes('refund')) botReply = "For refunds, please share your Order ID.";
      if (input.toLowerCase().includes('late')) botReply = "I'm sorry your order is late! Checking driver location... 📍";
      if (input.toLowerCase().includes('hello')) botReply = "Hello! How can I assist you? 😊";

      const botMsg = { id: Date.now().toString() + 'b', text: botReply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 1500);
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
            <Text style={styles.headerTitle}>Yumigo Support</Text>
            <Text style={styles.headerSub}>Typically replies in 2 mins</Text>
        </View>
        <Ionicons name="headset" size={24} color="#fff" />
      </View>

      {/* CHAT AREA */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        onContentSizeChange={() => flatListRef.current.scrollToEnd()}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <View style={[
            styles.bubble, 
            item.sender === 'user' ? styles.userBubble : styles.botBubble
          ]}>
            <Text style={[
                styles.msgText, 
                item.sender === 'user' ? styles.userText : styles.botText
            ]}>{item.text}</Text>
          </View>
        )}
      />

      {/* INPUT AREA */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inputContainer}>
            <TextInput 
                style={styles.input} 
                placeholder="Type a message..." 
                value={input}
                onChangeText={setInput}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                <Ionicons name="send" size={20} color="#fff" />
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
  headerSub: { color: '#ccc', fontSize: 12 },

  bubble: { maxWidth: '80%', padding: 12, borderRadius: 15, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007AFF', borderBottomRightRadius: 2 },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 2 },
  
  msgText: { fontSize: 16 },
  userText: { color: '#fff' },
  botText: { color: '#333' },

  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 20, marginRight: 10 },
  sendBtn: { backgroundColor: '#007AFF', padding: 10, borderRadius: 25 },
});