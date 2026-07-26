import subprocess

sql = """
UPDATE articulos
SET metadata = jsonb_set(
  metadata,
  '{areas}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN lower(elem) = 'caracter' THEN 'carácter'
        ELSE lower(elem)
      END
    )
    FROM jsonb_array_elements_text(metadata->'areas') AS elem
  )
)
WHERE metadata->'areas' IS NOT NULL;
"""

cmd = ['docker', 'exec', '-i', 'supabase_db_nuamana-local', 'psql', '-U', 'postgres', '-d', 'postgres', '-c', sql]
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
print("Areas normalization result:")
print(res.stdout)
