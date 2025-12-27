import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0); // Initial Balance
  
  // 👇 Store Transaction History
  const [transactions, setTransactions] = useState([
    { id: '1', title: 'Welcome Bonus', amount: 500, type: 'credit', date: new Date().toDateString() }
  ]);

  // 1. PAY (Deduct Money)
  const payFromWallet = (amount, description) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      // Add to history
      const newTxn = {
        id: Date.now().toString(),
        title: description || 'Payment',
        amount: amount,
        type: 'debit',
        date: new Date().toDateString()
      };
      setTransactions(prev => [newTxn, ...prev]); // Add to top
      return true;
    }
    return false;
  };

  // 2. ADD MONEY (Top Up)
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

;
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
export default useWallet;