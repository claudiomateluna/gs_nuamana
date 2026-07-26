import re

with open(r'C:\Users\claud\.gemini\antigravity-cli\brain\1a6629cd-bb47-41eb-8e2a-da64d2f5d41e\.system_generated\steps\331\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract headings and game titles
headings = re.findall(r'<h[234][^>]*>(.*?)</h[234]>', text, re.DOTALL)

clean_titles = []
for h in headings:
    # remove inner tags
    t = re.sub(r'<[^>]+>', '', h).strip()
    if t and len(t) > 3 and not t.startswith('Search') and not t.startswith('Navegación'):
        clean_titles.append(t)

print("Found games on gspau.es page:")
for i, t in enumerate(clean_titles, 1):
    print(f"  {i:2d}. {t}")
