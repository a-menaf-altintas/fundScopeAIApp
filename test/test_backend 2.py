#!/usr/bin/env python3
import subprocess
import json

def main():
    # Ask the user for input to send to the backend
    print("Enter user profile information to test the backend:")
    user_profile = input("User Profile: ")

    # Create a JSON payload
    payload = json.dumps({"userProfile": user_profile})

    # Build the curl command. Adjust the URL if needed.
    curl_command = [
        "curl",
        "-X", "POST",
        "-H", "Content-Type: application/json",
        "-d", payload,
        "http://localhost:5001/api/llama/recommend"
    ]

    print("\nRunning curl command to test the backend...")
    # Execute the curl command and capture output
    result = subprocess.run(curl_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    print("\n=== Response ===")
    print(result.stdout)
    if result.stderr:
        print("\n=== Errors ===")
        print(result.stderr)

if __name__ == "__main__":
    main()