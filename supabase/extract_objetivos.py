import subprocess

sql = "SET client_encoding = 'UTF8'; SELECT DISTINCT jsonb_array_elements_text(metadata->'objetivos') FROM articulos WHERE metadata->'objetivos' IS NOT NULL ORDER BY 1;"
cmd = ["docker", "exec", "-i", "supabase_db_nuamana-local", "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", sql]

res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
raw_bytes = res.stdout

# Try UTF-8 first, fallback to latin-1
try:
    text = raw_bytes.decode('utf-8')
except UnicodeDecodeError:
    text = raw_bytes.decode('latin-1')

lines = [l.strip() for l in text.splitlines() if l.strip()]

print(f"Total Objetivos Generales: {len(lines)}\n")
for i, l in enumerate(lines, 1):
    print(f'  "{l}",')
