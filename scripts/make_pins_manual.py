import pandas as pd

df = pd.read_csv('pins_with_link.csv')
with open('pins_manual.txt', 'w', encoding='utf-8') as f:
    for i, row in df.iterrows():
        f.write(f"\n=== PIN {i+1} ===\n")
        f.write(f"Title: {row['Pin Title']}\n")
        f.write(f"Description: {row['Pin Description']}\n")
        f.write(f"Link: {row['Link']}\n")
        f.write(f"Image URL: {row['Image URL Placeholder']}\n")