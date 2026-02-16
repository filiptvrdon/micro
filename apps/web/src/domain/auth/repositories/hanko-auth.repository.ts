import * as jose from "jose";
import { Hanko } from "@teamhanko/hanko-elements";
import type { AuthRepository } from "./auth-repository.interface.ts";
import type { AuthSession } from "../types/session.ts";

// Vite exposes only variables prefixed with VITE_. Ensure it's provided at build time.
const hankoApi = (import.meta.env.VITE_HANKO_AUTH_URL as string) || "";

export class HankoAuthRepository implements AuthRepository {
  private hanko: Hanko;

  constructor() {
    if (!hankoApi) {
      console.error("VITE_HANKO_AUTH_URL is not defined. Set it in your deployment environment.");
    }
    // Even if empty, construct to keep type, but methods guard when needed
    this.hanko = new Hanko(hankoApi || "");
  }

  getSession(): AuthSession | null {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hanko="))
      ?.split("=")[1];

    if (!token) return null;

    try {
      const payload = jose.decodeJwt(token);
      return {
        userId: payload.sub as string,
        jwt: token,
        isValid: true, // We should verify it separately if needed
      };
    } catch (e) {
      return null;
    }
  }

  async verifySession(jwt: string): Promise<boolean> {
    if (!hankoApi) return false;
    try {
      const JWKS = jose.createRemoteJWKSet(
        new URL(`${hankoApi}/.well-known/jwks.json`)
      );

      const { payload } = await jose.jwtVerify(jwt, JWKS);
      return !!payload.sub;
    } catch (e) {
      console.error("JWT verification failed:", e);
      return false;
    }
  }

  async logout(): Promise<void> {
    if (!hankoApi) return;
    // @ts-ignore - hanko.user is private in some versions of the SDK but we need to call logout on it
    await this.hanko.user.logout();
  }
}
