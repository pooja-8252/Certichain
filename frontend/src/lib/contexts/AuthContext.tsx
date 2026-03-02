// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';

// type UserType = 'student' | 'institute' | null;

// interface AuthContextType {
//   isLoggedIn: boolean;
//   userType: UserType;
//   login: (type: UserType) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userType, setUserType] = useState<UserType>(null);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     const saved = localStorage.getItem('userType');
//     if (saved) {
//       setIsLoggedIn(true);
//       setUserType(saved as UserType);
//     }
//   }, []);

//   const login = (type: UserType) => {
//     setIsLoggedIn(true);
//     setUserType(type);
//     if (type) localStorage.setItem('userType', type);
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     setUserType(null);
//     localStorage.removeItem('userType');
//   };

//   if (!mounted) return null;

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };

//updated one for handling admin also...

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

type UserType = 'student' | 'institute' | 'admin' | null;

interface AuthContextType {
  isLoggedIn: boolean;
  userType: UserType;
  walletAddress: string | null;
  isAdmin: boolean;
  // login: (type: UserType) => void;
  login: (type: UserType, wallet?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS?.toLowerCase();

  // ── Check wallet on mount and on account change ──────────────────────────────
  useEffect(() => {
    setMounted(true);

    // Restore student/institute session
    const saved = localStorage.getItem('userType');
    if (saved && saved !== 'admin') {
      setIsLoggedIn(true);
      setUserType(saved as UserType);
    }

    // Check MetaMask wallet
    checkWallet();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => checkWallet());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkWallet);
      }
    };
  }, []);

  async function checkWallet() {
    try {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length === 0) {
        setWalletAddress(null);
        setIsAdmin(false);
        return;
      }
      const address = await accounts[0].getAddress();
      setWalletAddress(address);
      const adminMatch = address.toLowerCase() === ADMIN_ADDRESS;
      setIsAdmin(adminMatch);

      // If admin wallet is connected, set session
      // if (adminMatch) {
      //   setIsLoggedIn(true);
      //   setUserType('admin');
      //   localStorage.setItem('userType', 'admin');
      // }

       if (adminMatch) {
  setIsLoggedIn(true);
  setUserType('admin');
  localStorage.setItem('userType', 'admin');
} else {
  // Check if institute switched wallet
  const savedType = localStorage.getItem('userType');
  const sessionWallet = localStorage.getItem('sessionWallet');
  if (savedType === 'institute' && sessionWallet) {
    if (address.toLowerCase() !== sessionWallet) {
      // Wrong wallet — logout institute
      setIsLoggedIn(false);
      setUserType(null);
      localStorage.removeItem('userType');
      localStorage.removeItem('sessionWallet');
    }
  }
}


    } catch {
      // MetaMask not connected, ignore
    }
  }

  // const login = (type: UserType) => {
  //   setIsLoggedIn(true);
  //   setUserType(type);
  //   if (type) localStorage.setItem('userType', type);
  // };

  const login = (type: UserType, wallet?: string) => {
  setIsLoggedIn(true);
  setUserType(type);
  if (type) localStorage.setItem('userType', type);
  if (wallet) localStorage.setItem('sessionWallet', wallet.toLowerCase());
};

  // const logout = () => {
  //   setIsLoggedIn(false);
  //   setUserType(null);
  //   setIsAdmin(false);
  //   localStorage.removeItem('userType');
  // };


  const logout = () => {
  setIsLoggedIn(false);
  setUserType(null);
  setIsAdmin(false);
  localStorage.removeItem('userType');
  localStorage.removeItem('sessionWallet');
};


  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, walletAddress, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};