import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import requests
import time
import json
from datetime import datetime

# ========== CONFIGURATION ==========
SERVICE_ACCOUNT_FILE = "service_account.json"
SHEET_NAME = "Pinterest Automation"
WORKSHEET_NAME = "Sheet1"

OPENROUTER_API_KEY = "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"  # REPLACE with your OpenRouter key
PINTEREST_ACCESS_TOKEN = "your_pinterest_token"  # REPLACE
PINTEREST_BOARD_ID = "your_board_id"  # REPLACE

# ========== GOOGLE SHEETS SETUP ==========
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name(SERVICE_ACCOUNT_FILE, scope)
client = gspread.authorize(creds)

sheet = client.open(SHEET_NAME).worksheet(WORKSHEET_NAME)

def get_pending_rows():
    records = sheet.get_all_records()
    df = pd.DataFrame(records)
    pending = df[df['Status'] == 'Pending']
    return pending

def generate_description(topic):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    prompt = f"""You are a social media expert for 'Fast Image Tools', a free online image editor website. Write an engaging Pinterest pin description for the topic: {topic}.

The description should:
- Be 2-3 sentences
- Include the topic keyword naturally
- Mention the tool is free and private (no uploads)
- End with 3-5 relevant hashtags
- Friendly, helpful tone
"""
    data = {
        "model": "deepseek/deepseek-chat",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.8,
        "max_tokens": 200
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content'].strip()
    else:
        print(f"AI error: {response.text}")
        return None

def post_to_pinterest(title, description, link, image_url, board_id):
    url = "https://api.pinterest.com/v5/pins"
    headers = {
        "Authorization": f"Bearer {PINTEREST_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "title": title,
        "description": description,
        "link": link,
        "image_url": image_url,
        "board_id": board_id
    }
    response = requests.post(url, headers=headers, json=data)
    return response

def update_row_status(row_number, status="Posted"):
    cell = f"F{row_number+1}"
    sheet.update(cell, status)
    date_cell = f"G{row_number+1}"
    sheet.update(date_cell, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

def main():
    pending = get_pending_rows()
    if pending.empty:
        print("No pending pins.")
        return

    for idx, row in pending.iterrows():
        row_number = idx + 2
        topic = row['Topic']
        image_url = row['Image URL']
        link = row['Link']
        board_id = PINTEREST_BOARD_ID

        print(f"Processing row {row_number}: {topic}")

        description = generate_description(topic)
        if not description:
            print(f"Skipping row {row_number} due to AI error.")
            continue

        response = post_to_pinterest(topic, description, link, image_url, board_id)
        if response.status_code == 201:
            print(f"Pin created successfully for {topic}")
            update_row_status(row_number, "Posted")
        else:
            print(f"Pinterest error for {topic}: {response.status_code} - {response.text}")

        time.sleep(2)

if __name__ == "__main__":
    main()