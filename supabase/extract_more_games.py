import re

with open(r'C:\Users\claud\.gemini\antigravity-cli\brain\1a6629cd-bb47-41eb-8e2a-da64d2f5d41e\.system_generated\steps\331\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

def get_game_snippet(title, length=1500):
    pos = text.find(title)
    if pos != -1:
        return text[pos:pos+length]
    return "Not found"

print("=== LOS SUBMARINOS ===")
print(get_game_snippet("Los Submarinos"))

print("\n=== LA BATALLA DE GLOBOS / COMBATE DE GLOBOS ===")
print(get_game_snippet("batalla de globos"))

print("\n=== ANIMALES QUE SON VENERADOS ===")
print(get_game_snippet("Animales que son venerados"))
