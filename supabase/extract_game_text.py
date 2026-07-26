import re

with open(r'C:\Users\claud\.gemini\antigravity-cli\brain\1a6629cd-bb47-41eb-8e2a-da64d2f5d41e\.system_generated\steps\331\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

def get_game_snippet(title):
    pos = text.find(title)
    if pos != -1:
        return text[pos:pos+1500]
    return "Not found"

print("=== CUATRO ESQUINAS ===")
print(get_game_snippet("Cuatro esquinas"))

print("\n=== LOS SUBMARINOS ===")
print(get_game_snippet("Los Submarinos"))
