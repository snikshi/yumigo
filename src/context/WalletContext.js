import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0); 
  const [tokens, setTokens] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 👇 FETCH REAL DATA FROM BACKEND
  const fetchWallet = async () => {
    if (!user?.id && !user?._id) return;
    try {
        const userId = user._id || user.id;
        // Replace with your Render URL
        const res = await fetch(`https://yumigo-api.onrender.com/api/wallet/${userId}`);
        const data = await res.json();
        
        if (data.success) {
            setBalance(data.walletBalance || 0);
            setTokens(data.yumiTokens || 0);
            setWalletAddress(data.walletAddress || "Generating...");
            setTransactions(data.transactions || []);
        }
    } catch (e) {
        console.error("Wallet Fetch Error", e);
    }
  };

  // Auto-Refresh when user changes
  useEffect(() => {
    fetchWallet();
  }, [user]);

  // 👇 SWAP LOGIC
  const swapTokens = async (amount) => {
    setLoading(true);
    try {
        const userId = user._id || user.id;
        const res = await fetch('https://yumigo-api.onrender.com/api/wallet/swap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, tokenAmount: Number(amount) })
        });
        const data = await res.json();
        
        if (data.success) {
            await fetchWallet(); // Refresh UI
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message };
        }
    } catch (e) {
        return { success: false, message: "Network Error" };
    } finally {
        setLoading(false);
    }
  };

  const payFromWallet = async (amount) => {
      // (Keep your existing payment logic here if needed, or implement backend debit)
      if (balance >= amount) {
          setBalance(prev => prev - amount);
          return true;
      }
      return false;
  };

  const addMoney = (amount) => {
      setBalance(prev => prev + Number(amount));
      // In real app, call Payment Gateway API here
  };

  return (
    <WalletContext.Provider value={{ balance, tokens, walletAddress, transactions, swapTokens, payFromWallet, addMoney, refreshWallet: fetchWallet, loading }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet error");
  return context;
};