import type { AuthSession } from "../types/session.ts";

export interface AuthRepository {
  getSession(): AuthSession | null;
  verifySession(jwt: string): Promise<boolean>;
  logout(): Promise<void>;
}
