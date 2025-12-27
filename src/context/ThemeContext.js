import React, { createContext, useState, useContext } from 'react';
import { StatusBar } from 'react-native';

const ThemeContext = createContext();

export const lightColors = {
  background: '#ffffff',
  text: '#000000',
  card: '#f8f9fa',
  icon: '#000000',
  header: '#ffffff'
};

export const darkColors = {
  background: '#121212',
  text: '#ffffff',
  card: '#1e1e1e',
  icon: '#ffffff',
  header: '#000000'
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {/* Auto-update the Status Bar (Battery/Time icons) */}
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);