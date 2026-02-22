import { useEffect } from "react";
import { register } from "@teamhanko/hanko-elements";
import { useTheme } from "@/components/theme-provider.tsx";

const hankoApi = (import.meta.env.VITE_HANKO_AUTH_URL as string) || "";

export function HankoProfile() {
  const { theme } = useTheme();

  useEffect(() => {
    if (!hankoApi) {
      console.error("VITE_HANKO_AUTH_URL is not defined. Set it in your deployment environment.");
      return;
    }
    register(hankoApi).catch((error) => {
      console.error("Hanko register failed:", error);
    });
  }, []);

  // @ts-expect-error - Hanko is a web component
  return <hanko-profile theme={theme === "system" ? undefined : theme} />;
}
