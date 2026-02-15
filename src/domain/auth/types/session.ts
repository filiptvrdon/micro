export interface AuthSession {
  userId: string;
  jwt: string;
  isValid: boolean;
}
