import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { AuthSession } from "@/domain/auth/types/session.ts";
import type { AuthRepository } from "@/domain/auth/repositories/auth-repository.interface.ts";
import { HankoAuthRepository } from "@/domain/auth/repositories/hanko-auth.repository.ts";
import { DevAuthRepository } from "@/domain/auth/repositories/dev-auth.repository.ts";

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  authRepository: AuthRepository;
  loginAsDev?: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authRepository] = useState<AuthRepository>(() =>
    import.meta.env.DEV ? new DevAuthRepository() : new HankoAuthRepository()
  );
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
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
  }, [authRepository]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void checkSession();
  }, [checkSession]);

  const logout = async () => {
    await authRepository.logout();
    setSession(null);
  };

  const loginAsDev = async () => {
    if (authRepository instanceof DevAuthRepository) {
      setIsLoading(true);
      await authRepository.loginAsDev();
      await checkSession();
    }
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, logout, authRepository, loginAsDev, refreshSession: checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
