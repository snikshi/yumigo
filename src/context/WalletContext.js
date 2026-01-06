import React, { createContext, useState, useContext } from 'react';

// 1. Create Context
const WalletContext = createContext();

// 2. Named Export for Provider
export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0); 
  
  const [transactions, setTransactions] = useState([
    { id: '1', title: 'Welcome Bonus', amount: 500, type: 'credit', date: new Date().toDateString() }
  ]);

  const payFromWallet = (amount) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      const newTxn = {
        id: Date.now().toString(),
        title: 'Order Payment',
        amount: amount,
        type: 'debit',
        date: new Date().toDateString()
      };
      setTransactions(prev => [newTxn, ...prev]);
      return true;
    }
    return false;
  };

  const addMoney = (amount) => {
    setBalance(prev => prev + Number(amount));
    const newTxn = {
        id: Date.now().toString(),
        title: 'Wallet Top-up',
        amount: Number(amount),
        type: 'credit',
        date: new Date().toDateString()
    };
    setTransactions(prev => [newTxn, ...prev]);
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, payFromWallet, addMoney }}>
      {children}
    </WalletContext.Provider>
  );
};

// 3. Named Export for Hook (ONLY THIS ONE)
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};