import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user with Firestore data
  const syncUserWithProfile = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        setUser({ ...firebaseUser, ...userDoc.data() });
      } else {
        // Fallback to basic auth user if doc doesn't exist
        setUser(firebaseUser);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(firebaseUser);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      syncUserWithProfile(firebaseUser);
    });

    return () => unsubscribe();
  }, [syncUserWithProfile]);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      return userCredential.user;
    } catch (error) {
      const message = error.code || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    const { email, password, name, ...profileData } = userData;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update basic profile
      await updateProfile(userCredential.user, { displayName: name });

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        ...profileData
      });

      toast.success("Account created successfully!");
      return userCredential.user;
    } catch (error) {
      const message = error.code || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const updateUserProfile = async (updatedData) => {
    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), updatedData, { merge: true });
      setUser(prev => ({ ...prev, ...updatedData }));
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Failed to update profile");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser: updateUserProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};