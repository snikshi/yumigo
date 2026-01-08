import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ id: '0', text: 'Hi! I am Yumi. Hungry? 🍔', sender: 'ai' }]);
  const [loading, setLoading] = useState(false);

  // 🟢 OPEN CHAT
  const openChat = (initialQuery = null) => {
    setIsOpen(true);
    if (initialQuery) {
      sendMessage(initialQuery);
    }
  };

  const closeChat = () => setIsOpen(false);

  // 🟢 SEND MESSAGE TO BACKEND
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now().toString(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Call Backend
      const res = await fetch('https://yumigo-api.onrender.com/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userId: user?.id })
      });
      const data = await res.json();
      
      const text = await res.text(); // Read as text first
console.log("SERVER RESPONSE:", text); // See what the HTML says!

try {
    const data = JSON.parse(text); // Try to parse manually
    // ... proceed with data
} catch (e) {
    console.error("NOT JSON! likely 404 or 500 error");
}

      // 3. Add AI Response
      const aiMsg = { 
        id: Date.now() + 1, 
        text: data.reply, 
        sender: 'ai',
        action: data.action,
        data: data.data,
        query: text // Save query for feedback
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now(), text: "Network error 😵", sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 FEEDBACK LOOP (Auto-Upgrade)
  const sendFeedback = async (msgId, rating, query, response) => {
    try {
        await fetch('https://yumigo-api.onrender.com/api/ai/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, response, rating })
        });
        // Update UI to show thanks
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, rated: true } : m));
    } catch(e) {
        console.error("Feedback failed");
    }
  };

  return (
    <AIContext.Provider value={{ isOpen, openChat, closeChat, messages, sendMessage, loading, sendFeedback }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);