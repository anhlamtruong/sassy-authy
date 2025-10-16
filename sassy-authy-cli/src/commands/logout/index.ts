import { clearAuthToken } from "../../utils/auth.js";

export function logoutCommand() {
  clearAuthToken();
  console.log("✅ Successfully logged out.");
}
