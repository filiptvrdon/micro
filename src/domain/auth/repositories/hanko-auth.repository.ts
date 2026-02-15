import * as jose from "jose";
import { Hanko } from "@teamhanko/hanko-elements";
import type { AuthRepository } from "./auth-repository.interface";
import type { AuthSession } from "../types/session";

const hankoApi = import.meta.env.VITE_HANKO_API_URL || import.meta.env.HANKO_AUTH_URL;

export class HankoAuthRepository implements AuthRepository {
  private hanko: Hanko;

  constructor() {
    this.hanko = new Hanko(hankoApi);
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
    await this.hanko.user.logout();
  }
}
