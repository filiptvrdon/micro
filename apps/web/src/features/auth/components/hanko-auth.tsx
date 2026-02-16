import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { register, Hanko } from "@teamhanko/hanko-elements";

// Vite exposes only variables prefixed with VITE_. Ensure it's provided at build time.
const hankoApi = (import.meta.env.VITE_HANKO_AUTH_URL as string) || "";

export function HankoAuth() {
  const navigate = useNavigate();

  const redirectAfterLogin = useCallback(() => {
    navigate("/");
  }, [navigate]);

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

  return <hanko-auth />;
}
