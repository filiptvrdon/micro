import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { AuthSession } from "@/domain/auth/types/session";
import type { AuthRepository } from "@/domain/auth/repositories/auth-repository.interface";
import { HankoAuthRepository } from "@/domain/auth/repositories/hanko-auth.repository";

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  authRepository: AuthRepository;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authRepository] = useState(() => new HankoAuthRepository());
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const currentSession = authRepository.getSession();
      if (currentSession) {
        const isValid = await authRepository.verifySession(currentSession.jwt);
        if (isValid) {
          setSession(currentSession);
        } else {
          setSession(null);
        }
      } else {
        setSession(null);
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for cookie changes or Hanko events if possible
    // For simplicity, we check on mount and provide a logout method
  }, [authRepository]);

  const logout = async () => {
    await authRepository.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, logout, authRepository }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
