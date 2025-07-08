import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  isSubAdmin: boolean;
  canMakeChanges: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);

  // Admin credentials
  const ADMIN_EMAIL = "admin@catrink.in";
  const ADMIN_PASSWORD = "HardikSri@123";

  // Sub-admin credentials (demo access)
  const SUB_ADMIN_EMAIL = "demo@catrink.com";
  const SUB_ADMIN_PASSWORD = "demo123";

  // Can make changes (only full admin can make changes)
  const canMakeChanges = isAdmin && !isSubAdmin;

  // Load session from localStorage on app start
  useEffect(() => {
    const savedSession = localStorage.getItem("catrink_session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.email === ADMIN_EMAIL) {
          setIsAdmin(true);
          setIsSubAdmin(false);
          const mockAdmin = {
            uid: "admin-uid",
            email: ADMIN_EMAIL,
            displayName: "Admin",
          } as User;
          setCurrentUser(mockAdmin);
        } else if (session.email === SUB_ADMIN_EMAIL) {
          setIsAdmin(true);
          setIsSubAdmin(true);
          const mockSubAdmin = {
            uid: "sub-admin-uid",
            email: SUB_ADMIN_EMAIL,
            displayName: "Demo Admin",
          } as User;
          setCurrentUser(mockSubAdmin);
        } else {
          // For regular users, restore from saved session
          setCurrentUser(session);
          setIsAdmin(false);
          setIsSubAdmin(false);
        }
      } catch (error) {
        console.error("Error loading session:", error);
        localStorage.removeItem("catrink_session");
      }
    }
    setLoading(false);
  }, []);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const savedSession = localStorage.getItem("catrink_session");

      if (user && !isAdmin) {
        setCurrentUser(user);
        // Save new Firebase user session
        localStorage.setItem(
          "catrink_session",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            isAdmin: false,
          }),
        );
      } else if (!user && !isAdmin && !savedSession) {
        setCurrentUser(null);
        setIsAdmin(false);
      }

      if (!savedSession) {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [isAdmin]);

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    // Check if it's admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // For admin, we'll create a mock user session
      setIsAdmin(true);
      setIsSubAdmin(false);
      const mockAdmin = {
        uid: "admin-uid",
        email: ADMIN_EMAIL,
        displayName: "Admin",
      } as User;
      setCurrentUser(mockAdmin);

      // Save admin session to localStorage
      localStorage.setItem(
        "catrink_session",
        JSON.stringify({
          uid: mockAdmin.uid,
          email: mockAdmin.email,
          displayName: mockAdmin.displayName,
          isAdmin: true,
          isSubAdmin: false,
        }),
      );

      return Promise.resolve({ user: mockAdmin });
    } else if (email === SUB_ADMIN_EMAIL && password === SUB_ADMIN_PASSWORD) {
      // For sub-admin (demo), create a mock user session
      setIsAdmin(true);
      setIsSubAdmin(true);
      const mockSubAdmin = {
        uid: "sub-admin-uid",
        email: SUB_ADMIN_EMAIL,
        displayName: "Demo Admin",
      } as User;
      setCurrentUser(mockSubAdmin);

      // Save sub-admin session to localStorage
      localStorage.setItem(
        "catrink_session",
        JSON.stringify({
          uid: mockSubAdmin.uid,
          email: mockSubAdmin.email,
          displayName: mockSubAdmin.displayName,
          isAdmin: true,
          isSubAdmin: true,
        }),
      );

      return Promise.resolve({ user: mockSubAdmin });
    } else {
      // Regular Firebase authentication
      setIsAdmin(false);
      setIsSubAdmin(false);
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Save user session to localStorage
      if (result.user) {
        localStorage.setItem(
          "catrink_session",
          JSON.stringify({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            isAdmin: false,
            isSubAdmin: false,
          }),
        );
      }

      return result;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setIsAdmin(false);
    setIsSubAdmin(false);
    // Clear localStorage session
    localStorage.removeItem("catrink_session");
  };

  const resetPassword = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    loading,
    isAdmin,
    isSubAdmin,
    canMakeChanges,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
