import requests

API_KEY = "sk-a6adfb79b7054e47b531627dca9dc0f1"  # your exact key
url = "https://api.deepseek.com/v1/chat/completions"
headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
payload = {
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
}

response = requests.post(url, headers=headers, json=payload)
print("Status:", response.status_code)
print("Response:", response.text)