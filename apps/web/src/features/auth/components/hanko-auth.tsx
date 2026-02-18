import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { register, Hanko } from "@teamhanko/hanko-elements";
import { useTheme } from "@/components/theme-provider.tsx";
import { useAuth } from "@/providers/auth-provider.tsx";

// Vite exposes only variables prefixed with VITE_. Ensure it's provided at build time.
const hankoApi = (import.meta.env.VITE_HANKO_AUTH_URL as string) || "";

export function HankoAuth() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { refreshSession } = useAuth();

  const redirectAfterLogin = useCallback(async () => {
    await refreshSession();
    navigate("/");
  }, [navigate, refreshSession]);

  useEffect(() => {
    if (!hankoApi) {
      console.error("VITE_HANKO_AUTH_URL is not defined. Set it in your deployment environment.");
      return;
    }
    const hanko = new Hanko(hankoApi);
    hanko.onSessionCreated(() => {
      redirectAfterLogin();
    });
  }, [redirectAfterLogin]);

  useEffect(() => {
    if (!hankoApi) return;
    register(hankoApi).catch((error) => {
      console.error("Hanko register failed:", error);
    });
  }, []);

  // @ts-ignore
  return <hanko-auth theme={theme === "system" ? undefined : theme} />;
}
