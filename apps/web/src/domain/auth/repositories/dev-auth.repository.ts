import type { AuthRepository } from "./auth-repository.interface.ts";
import type { AuthSession } from "../types/session.ts";

const DEV_USER_ID = "dev-user-123";
const DEV_TOKEN = "dev-token-secret";

export class DevAuthRepository implements AuthRepository {
  getSession(): AuthSession | null {
    const isDevLoggedIn = localStorage.getItem("dev_logged_in") === "true";
    if (!isDevLoggedIn) return null;

    return {
      userId: DEV_USER_ID,
      jwt: DEV_TOKEN,
      isValid: true,
    };
  }

  async verifySession(jwt: string): Promise<boolean> {
    return jwt === DEV_TOKEN;
  }

  async logout(): Promise<void> {
    localStorage.removeItem("dev_logged_in");
  }

  async loginAsDev(): Promise<void> {
    localStorage.setItem("dev_logged_in", "true");
  }
}
