import subprocess

sql = "SELECT slug, imagen_destacada FROM articulos WHERE estado = 'publicado' ORDER BY created_at DESC LIMIT 20;"
cmd = ['docker', 'exec', '-i', 'supabase_db_nuamana-local', 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A', '-c', sql]
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
print("=== LOCAL POSTGRES IMAGEN_DESTACADA ===")
print(res.stdout)
