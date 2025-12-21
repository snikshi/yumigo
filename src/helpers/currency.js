export const formatPrice = (price) => {
  // 🟢 OLD WAY: return `₹${(price * 85).toFixed(0)}`; 
  
  // 🟢 NEW WAY: No multiplication needed!
  return `₹${Number(price).toFixed(0)}`;
};