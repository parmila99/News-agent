import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  isAdmin: boolean;
  isReporter: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          
          const isMasterAdmin = currentUser.email === 'rahulrajbanshi981052@gmail.com';
          const defaultRole: UserRole = isMasterAdmin ? 'admin' : 'reporter'; // Default to reporter for testing dashboard features

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setProfile(data);
          } else {
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Rahul Prasad Rajbanshi',
              photoURL: currentUser.photoURL || '',
              role: defaultRole,
              pressBadgeNumber: 'RGNN-PRESS-' + Math.floor(1000 + Math.random() * 9000),
              organization: 'Rajbanshi Global News Network',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          console.warn('Error fetching user profile from Firestore:', err);
          // Fallback in-memory profile
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Rahul Prasad Rajbanshi',
            photoURL: currentUser.photoURL || '',
            role: currentUser.email === 'rahulrajbanshi981052@gmail.com' ? 'admin' : 'reporter',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // Guest / default admin mock profile for immediate access to admin tools
        setProfile({
          uid: 'guest-admin-01',
          email: 'rahulrajbanshi981052@gmail.com',
          displayName: 'Rahul Prasad Rajbanshi',
          role: 'admin',
          pressBadgeNumber: 'RGNN-FOUNDER-001',
          organization: 'Rajbanshi Global News Network',
          createdAt: new Date().toISOString()
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      // If popup fails or is blocked in iframe, set mock authenticated user
      const guestProfile: UserProfile = {
        uid: 'user-demo-' + Date.now(),
        email: 'rahulrajbanshi981052@gmail.com',
        displayName: 'Rahul Prasad Rajbanshi',
        role: 'admin',
        pressBadgeNumber: 'RGNN-PRESS-8821',
        createdAt: new Date().toISOString()
      };
      setProfile(guestProfile);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
      setProfile(null);
    }
  };

  const switchRole = async (newRole: UserRole) => {
    if (profile) {
      const updated = { ...profile, role: newRole };
      setProfile(updated);
      if (user) {
        try {
          await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
        } catch (e) {
          console.warn('Could not persist role switch to Firestore:', e);
        }
      }
    }
  };

  const isAdmin = profile?.role === 'admin' || profile?.email === 'rahulrajbanshi981052@gmail.com';
  const isReporter = profile?.role === 'reporter' || profile?.role === 'editor' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        logout,
        switchRole,
        isAdmin,
        isReporter,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
