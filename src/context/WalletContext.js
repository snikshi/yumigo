import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext'; // 👈 1. Import Auth to get User ID

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { user } = useAuth(); // 👈 Get the current user
  
  const [balance, setBalance] = useState(0); 
  const [transactions, setTransactions] = useState([]);

  // 👇 2. LOAD DATA (Specific to User)
  useEffect(() => {
    const loadWalletData = async () => {
        if (!user || !user.id) {
            // No user logged in? Reset wallet to empty
            setBalance(0);
            setTransactions([]);
            return;
        }

        try {
            // Use Unique Keys: e.g., "wallet_balance_123"
            const storedBalance = await AsyncStorage.getItem(`wallet_balance_${user.id}`);
            const storedTrans = await AsyncStorage.getItem(`wallet_trans_${user.id}`);

            if (storedBalance !== null) {
                setBalance(Number(storedBalance)); 
            } else {
                setBalance(500); // New User Bonus
            }

            if (storedTrans !== null) {
                setTransactions(JSON.parse(storedTrans));
            } else {
                 setTransactions([{ id: '1', title: 'Welcome Bonus', amount: 500, type: 'credit', date: new Date().toDateString() }]);
            }
        } catch (error) {
            console.error("Failed to load wallet", error);
        }
    };
    loadWalletData();
  }, [user]); // 👈 Run this whenever 'user' changes!

  // 👇 3. Helper: Save to Unique Keys
  const saveData = async (newBalance, newTransactions) => {
      if (!user || !user.id) return; // Safety check
      try {
          await AsyncStorage.setItem(`wallet_balance_${user.id}`, newBalance.toString());
          await AsyncStorage.setItem(`wallet_trans_${user.id}`, JSON.stringify(newTransactions));
      } catch (error) {
          console.error("Failed to save wallet", error);
      }
  };

  const addMoney = (amount) => {
    const value = Number(amount);
    if (isNaN(value) || value <= 0) {
        Alert.alert("Invalid Amount", "Please enter a valid amount.");
        return;
    }

    const newBalance = balance + value;
    const newTransaction = { id: Date.now().toString(), title: 'Added to Wallet', amount: value, type: 'credit', date: new Date().toDateString() };
    const newTransactions = [newTransaction, ...transactions];

    setBalance(newBalance);
    setTransactions(newTransactions);
    saveData(newBalance, newTransactions); 

    Alert.alert("Success", `₹${value} added to wallet! 💰`);
  };

  const payFromWallet = (amount) => {
    if (balance >= amount) {
        const newBalance = balance - amount;
        const newTransaction = { id: Date.now().toString(), title: 'Payment', amount: amount, type: 'debit', date: new Date().toDateString() };
        const newTransactions = [newTransaction, ...transactions];

        setBalance(newBalance);
        setTransactions(newTransactions);
        saveData(newBalance, newTransactions);

        return true; 
    } else {
        return false; 
    }
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, addMoney, payFromWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);