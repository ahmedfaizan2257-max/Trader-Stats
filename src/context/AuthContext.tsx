import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  AuthProvider as FirebaseAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, microsoftProvider, appleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignIn = async (provider: FirebaseAuthProvider) => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
  };

  const handleSignUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) {
        await updateProfile(res.user, { displayName: name });
      }
      // Reload user so context gets the new name
      await res.user.reload();
      setUser({ ...auth.currentUser! });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleSignInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithGoogle: () => handleSignIn(googleProvider),
      signInWithMicrosoft: () => handleSignIn(microsoftProvider),
      signInWithApple: () => handleSignIn(appleProvider),
      signUpWithEmail: handleSignUpWithEmail,
      signInWithEmail: handleSignInWithEmail,
      logout: () => signOut(auth)
    }}>
      {children}
    </AuthContext.Provider>
  );
};
