import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { register, Hanko } from "@teamhanko/hanko-elements";

const hankoApi = import.meta.env.VITE_HANKO_AUTH_URL || import.meta.env.HANKO_AUTH_URL;

export function HankoAuth() {
  const navigate = useNavigate();

  const redirectAfterLogin = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const hanko = new Hanko(hankoApi);
    hanko.onSessionCreated(() => {
      redirectAfterLogin();
    });
  }, [redirectAfterLogin]);

  useEffect(() => {
    register(hankoApi).catch((error) => {
      console.error("Hanko register failed:", error);
    });
  }, []);

  return <hanko-auth />;
}
