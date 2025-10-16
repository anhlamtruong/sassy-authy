import axios from "axios";
import inquirer from "inquirer";
import { setAuthToken } from "../../utils/auth.js";

const API_URL = "https://api.creatawebsite.com/login"; // Your actual API endpoint

export async function loginCommand() {
  // Prompt the user for email and password
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Enter your email:",
    },
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
      mask: "*",
    },
  ]);

  try {
    // Send credentials to your authentication server
    const response = await axios.post(API_URL, {
      email: answers.email,
      password: answers.password,
    });

    // Assuming the server responds with { token: "your_jwt_token" }
    const { token } = response.data;

    if (!token) {
      console.error("❌ Login failed. No token received.");
      process.exit(1);
    }

    // Save the token
    setAuthToken(token);
    console.log("✅ Successfully logged in.");
  } catch (error) {
    console.error("❌ Login failed. Please check your credentials. " + error);
    process.exit(1);
  }
}
