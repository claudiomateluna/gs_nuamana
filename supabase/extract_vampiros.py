with open(r'C:\Users\claud\.gemini\antigravity-cli\brain\1a6629cd-bb47-41eb-8e2a-da64d2f5d41e\.system_generated\steps\331\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find("Son vampiros")
if pos != -1:
    print(text[pos:pos+1800])
else:
    print("Not found")
