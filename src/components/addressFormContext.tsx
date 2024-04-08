import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AddressFormState {
  country: string;
  zipCode: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  name: string;
  phone: string;
  email: string;
  companyName: string;
  companyVATNumber: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  setZipCode: React.Dispatch<React.SetStateAction<string>>;
  // Include setters for the rest of the fields...
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setAddressLine1: React.Dispatch<React.SetStateAction<string>>;
  setAddressLine2: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  setCompanyVATNumber: React.Dispatch<React.SetStateAction<string>>;
}

const AddressFormContext = createContext<AddressFormState | undefined>(undefined);

export const useAddressForm = () => {
  const context = useContext(AddressFormContext);
  if (!context) {
    throw new Error('useAddressForm must be used within a AddressFormProvider');
  }
  return context;
};

interface AddressFormProviderProps {
    children: ReactNode; // This allows any valid React node
}

export const AddressFormProvider: React.FC<AddressFormProviderProps> = ({ children }) => {
  // State hooks for all fields...
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyVATNumber, setCompanyVATNumber] = useState('');

  // The value object must include all state variables and their setters
  const value = {
    country, setCountry,
    zipCode, setZipCode,
    city, setCity,
    addressLine1, setAddressLine1,
    addressLine2, setAddressLine2,
    name, setName,
    phone, setPhone,
    email, setEmail,
    companyName, setCompanyName,
    companyVATNumber, setCompanyVATNumber,
    // Add other fields and their setters...
  };

  return <AddressFormContext.Provider value={value}>{children}</AddressFormContext.Provider>;
};
