import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { register, Hanko } from "@teamhanko/hanko-elements";
import { useTheme } from "@/components/theme-provider.tsx";
import { useAuth } from "@/providers/auth-provider.tsx";

// Vite exposes only variables prefixed with VITE_. Ensure it's provided at build time.
const hankoApi = (import.meta.env.VITE_HANKO_AUTH_URL as string) || "";
const apiUrl = (import.meta.env.VITE_API_URL as string) || "";

export function HankoAuth() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { refreshSession } = useAuth();

  const redirectAfterLogin = useCallback(async () => {
    await refreshSession();

    // Trigger a protected API call to ensure the user is persisted in the DB
    // The API middleware (`hankoAuth`) will create the user on first authenticated request
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hanko="))
        ?.split("=")[1];

      if (apiUrl && token) {
        console.log("Triggering user creation at:", `${apiUrl}/api/users/current`);
        const response = await fetch(`${apiUrl}/api/users/current`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const text = await response.text();
          console.error(`User creation trigger failed: ${response.status} ${text}`);
        } else {
          console.log("User creation trigger successful");
        }
      }
    } catch (e) {
      console.error("Failed to trigger user creation after login:", e);
    }

    navigate("/feed");
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

  // @ts-expect-error - Hanko is a web component
  return <hanko-auth theme={theme === "system" ? undefined : theme} />;
}
