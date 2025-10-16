import Configstore from "configstore";
import { name } from "../../package.json";

// Initialize configstore with your package name
const config = new Configstore(name);

/**
 * Saves the authentication token.
 * @param token - The authentication token to store.
 */
export function setAuthToken(token: string): void {
  config.set("authToken", token);
}

/**
 * Retrieves the stored authentication token.
 * @returns The stored token, or undefined if it doesn't exist.
 */
export function getAuthToken(): string | undefined {
  return config.get("authToken");
}

/**
 * Deletes the stored authentication token.
 */
export function clearAuthToken(): void {
  config.delete("authToken");
}
