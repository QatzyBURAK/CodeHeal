import sys
import json
import requests

# The engine URL (FastAPI)
API_URL = "http://127.0.0.1:8000/analyze"

def main():
    # Listen to standard input
    for line in sys.stdin:
        try:
            request_data = json.loads(line.strip())
            
            # Extract code from Bob's request
            code = request_data.get("params", {}).get("code", "")
            
            # Send HTTP POST to our local Engine
            response = requests.post(API_URL, json={"code": code})
            api_result = response.json()
            
            # Send the answer back to Bob IDE
            print(json.dumps(api_result), flush=True)
            
        except Exception as e:
            # Catch errors
            print(json.dumps({"error": str(e)}), flush=True)

if __name__ == "__main__":
    main()