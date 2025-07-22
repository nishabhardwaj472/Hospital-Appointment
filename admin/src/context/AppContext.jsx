import React, { createContext } from 'react';

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  // Function to calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';

    try {
      const birthDate = new Date(dob);

      if (isNaN(birthDate.getTime())) {
        console.error('Invalid date format for DOB:', dob);
        return 'N/A';
      }

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    } catch (error) {
      console.error('Error while calculating age:', error);
      return 'N/A';
    }
  };

    const slotDateFormat = (slot) => {
    if (!slot) return 'N/A';
    try {
      const date = new Date(slot);
      return date.toLocaleString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Invalid slot date:', error);
      return 'N/A';
    }
  };

  // Pass context values here
  return (
    <AppContext.Provider value={{ calculateAge, slotDateFormat }}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ Export default for flexible import
export default AppProvider;
