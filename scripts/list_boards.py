import os
import requests
from dotenv import load_dotenv

load_dotenv()
ACCESS_TOKEN = os.getenv("PINTEREST_ACCESS_TOKEN")
if not ACCESS_TOKEN:
    print("Please set PINTEREST_ACCESS_TOKEN in .env")
    exit(1)

url = "https://api.pinterest.com/v5/boards"
headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
response = requests.get(url, headers=headers)
if response.status_code == 200:
    boards = response.json().get("items", [])
    for board in boards:
        print(f"Name: {board['name']} | ID: {board['id']}")
else:
    print(f"Error: {response.status_code} - {response.text}")