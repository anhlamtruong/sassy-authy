import axios from "axios";
import { getAuthToken } from "../../utils/auth.js";
// ... (keep other imports like fs, path, etc.)

const PUSH_API_URL = "https://api.creatawebsite.com/components"; // Your component upload endpoint

export async function pushCommand({ name }: { name: string }) {
  const token = getAuthToken();

  // Check if the user is logged in
  if (!token) {
    console.error("❌ You are not logged in. Please run 'creata login' first.");
    process.exit(1);
  }

  console.log(`Attempting to push component: ${name}...`);

  try {
    // Example: Making an authenticated API request
    const response = await axios.post(
      PUSH_API_URL,
      {
        componentName: name,
        // ... (any other data you need to send)
      },
      {
        headers: {
          // Include the token in the Authorization header
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`✅ Component '${name}' pushed successfully!`);
    console.log("Server response:", response.data);
  } catch (error) {
    console.error("❌ Failed to push component.");
    // You might want to check for 401 Unauthorized errors specifically
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error("Your session may have expired. Please log in again.");
    }
    process.exit(1);
  }
}
